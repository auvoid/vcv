import {
  NestInterceptor,
  Injectable,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../modules/users/users.service';
import { createJsonWebToken, validateJsonWebToken } from '../utils/jwt';
import { Response } from 'express';
import { SessionsService } from 'src/modules/users/sessions.service';

export function IsAuthenticated() {
  return UseInterceptors(new IsAuthenticatedInterceptor());
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private userService: UsersService,
    private sessionsService: SessionsService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse<Response>();
    let { refreshToken } = req.cookies;

    if (!refreshToken) {
      const session = await this.sessionsService.create({
        isValid: false,
      });
      refreshToken = createJsonWebToken({ sessionId: session.id }, '1y');
      res.cookie('refreshToken', refreshToken, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.PUBLIC_BASE_URI.startsWith('https')
          ? 'none'
          : 'lax',
        secure: process.env.PUBLIC_BASE_URI.startsWith('https'),
      });
      req.session = session;
    }

    const { payload, expired } = validateJsonWebToken(refreshToken);

    if (payload && !expired) {
      req.session = await this.sessionsService.findById(payload.sessionId);
      if (!req.session) {
        const session = await this.sessionsService.create({
          isValid: false,
        });
        refreshToken = createJsonWebToken({ sessionId: session.id }, '1y');
        res.cookie('refreshToken', refreshToken, {
          maxAge: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: process.env.PUBLIC_BASE_URI.startsWith('https')
            ? 'none'
            : 'lax',
          secure: process.env.PUBLIC_BASE_URI.startsWith('https'),
        });
        req.session = session;
      }
    } else {
      const session = await this.sessionsService.create({
        isValid: false,
      });
      refreshToken = createJsonWebToken({ sessionId: session.id }, '1y');
      res.cookie('refreshToken', refreshToken, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.PUBLIC_BASE_URI.startsWith('https')
          ? 'none'
          : 'lax',
        secure: process.env.PUBLIC_BASE_URI.startsWith('https'),
      });
      req.session = session;
    }

    const token = req.headers.authorization
      ? req.headers.authorization.split('Bearer ')[1]
      : null;
    if (token) {
      const { expired, payload } = validateJsonWebToken(token);
      if (!payload || expired) return next.handle();
      if (payload.scope !== 'auth') return next.handle();
      req.user = await this.userService.findById(payload.userId);
      return next.handle();
    }
    return next.handle();
  }
}

@Injectable()
export class IsAuthenticatedInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    if (!req.user) throw new UnauthorizedException();
    return next.handle();
  }
}
