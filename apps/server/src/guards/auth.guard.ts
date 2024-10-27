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
import { validateJsonWebToken } from '../utils/jwt';

export function IsAuthenticated() {
  return UseInterceptors(new IsAuthenticatedInterceptor());
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
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
