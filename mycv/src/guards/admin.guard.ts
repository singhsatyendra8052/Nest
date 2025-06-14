import { ExecutionContext, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.currentUser;

    if (!user) {
      return false;
    }

    return user.admin;
  }
}
