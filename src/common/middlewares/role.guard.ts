import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class RoleGuard implements CanActivate {
  private logger: Logger;
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly reflector: Reflector,
  ) {
    this.logger = new Logger('Role Guard');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        'user_roles',
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const userInfo = request.user;
      if (!userInfo) {
        throw new UnauthorizedException('User is not authenticated');
      }

      const currentUserRole = await this.firebaseService.getUserRole(
        userInfo.id,
      );
      if (!requiredRoles.includes(currentUserRole)) {
        throw new ForbiddenException('User has not enough permission');
      }

      return true;
    } catch (err) {
      this.logger.error('Error on checking user role:', err);
      throw err;
    }
  }
}
