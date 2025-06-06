import { ExecutionContext, CanActivate } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const session = request.session;
    return session.userId;
  }
}
