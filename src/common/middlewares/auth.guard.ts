import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/model/models';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger: Logger;
  constructor(private authService: AuthService) {
    this.logger = new Logger('Authentication Guard');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        this.logger.error('Authorization header is not set');
        throw new UnauthorizedException('Authentication Failed!');
      }

      const token = authHeader.split(' ')[1];
      const result = await this.authService.verifyToken(token);
      if (!result.success) {
        throw new UnauthorizedException('Authentication Failed!');
      }

      request.user = {
        id: (result.data as User).id,
        email: (result.data as User).email,
      };

      return true;
    } catch (err) {
      this.logger.error('Error on Authentication:', err);
      throw err;
    }
  }
}
