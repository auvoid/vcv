import {
  NestInterceptor,
  Injectable,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  UseInterceptors,
  ForbiddenException,
  CanActivate,
  Type,
  SetMetadata,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export function IsAuthenticated() {
  return UseInterceptors(new IsAuthenticatedInterceptor());
}

export function IsStaff() {
  return UseInterceptors(new IsStaffInterceptor());
}

export function HasPermission(permission: string | string[]) {
  return UseInterceptors(new HasPermissionInterceptor(permission));
}

export const MultipleGuardsReferences = (...guards: Type<CanActivate>[]) =>
  SetMetadata('multipleGuardsReferences', guards);

@Injectable()
export class IsAuthenticatedInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    if (req.user || req.key) return next.handle();
    throw new UnauthorizedException();
  }
}

@Injectable()
export class IsStaffInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    if (req.key) return next.handle();
    if (req.user?.organization && req.user.isActive) return next.handle();
    throw new ForbiddenException();
  }
}

@Injectable()
export class HasPermissionInterceptor implements NestInterceptor {
  constructor(private _permissions: string | string[]) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const permissions = Array.isArray(this._permissions)
      ? this._permissions
      : [this._permissions];
    if (req.key) return next.handle();
    if (!req.user?.organization) throw new UnauthorizedException();
    const isOwner =
      req.user.organization && req.user.organization.ownedBy.id === req.user.id;

    for (const permission of permissions) {
      if ((req.user.role && req.user.role[permission]) || isOwner)
        return next.handle();
    }
    throw new UnauthorizedException();
  }
}

@Injectable()
export class MultipleAuthorizeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedGuards =
      this.reflector.get<Type<CanActivate>[]>(
        'multipleGuardsReferences',
        context.getHandler(),
      ) || [];

    const guards = allowedGuards.map((guardReference) =>
      this.moduleRef.get<CanActivate>(guardReference),
    );

    if (guards.length === 0) {
      return Promise.resolve(true);
    }

    if (guards.length === 1) {
      return guards[0].canActivate(context) as Promise<boolean>;
    }

    return Promise.any(
      guards.map((guard) => {
        return guard.canActivate(context) as Promise<boolean>;
      }),
    );
  }
}
