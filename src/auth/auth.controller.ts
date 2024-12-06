import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/common/middlewares/role.guard';
import { Response } from 'express';
import { Roles } from 'src/common/types';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/user.register.dto';
import { LoginUserDto } from './dto/user.login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  //   @UseGuards(RoleGuard)
  //   @Roles('admin')
  async registerUser(
    @Body() userInfo: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.registerUser(userInfo);

    response.status(result.code).json(result);
  }

  @Post('/login')
  async loginUser(
    @Body() authInfo: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.loginUser(authInfo);

    response.status(result.code).json(result);
  }
}
