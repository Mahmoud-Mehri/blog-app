import { HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RegisterUserDto } from './dto/user.register.dto';
import { ServiceResponse } from 'src/common/types';
import { errorResponse, successResponse } from 'src/common/utils';
import { LoginUserDto } from './dto/user.login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async registerUser(userInfo: RegisterUserDto): Promise<ServiceResponse> {
    try {
      const user = await this.firebaseService.createUser(
        userInfo.email,
        userInfo.password,
        userInfo.role,
      );

      return successResponse({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        return errorResponse(
          'Email address is already registered',
          HttpStatus.CONFLICT,
        );
      }
      if (err.code === 'auth/invalid-email') {
        return errorResponse('Email is not valid', HttpStatus.BAD_REQUEST);
      }
      return errorResponse(); // Will produce Internal Server Error by default
    }
  }

  async loginUser(loginInfo: LoginUserDto): Promise<ServiceResponse> {
    try {
      const token = await this.firebaseService.loginUser(
        loginInfo.email,
        loginInfo.password,
      );

      return successResponse({ token });
    } catch (err) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-email' ||
        err.code === 'auth/wrong-password'
      ) {
        return errorResponse('Invalid Credentials', HttpStatus.UNAUTHORIZED);
      }

      return errorResponse(); // Will produce Internal Server Error by default
    }
  }

  async verifyToken(token: string): Promise<ServiceResponse> {
    try {
      const user = await this.firebaseService.verifyToken(token);

      return successResponse(user);
    } catch (err) {
      if (err.code === 'auth/invalid-id-token') {
        return errorResponse('Authentication Failed', HttpStatus.UNAUTHORIZED);
      }
      return errorResponse(); // Will produce Internal Server Error by default
    }
  }

  // async getUserRole(userId: string): Promise<ServiceResponse> {

  // }
}
