import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Get the currently logged in user
 */

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
