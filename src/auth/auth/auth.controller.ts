import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ValidateUserDto } from '../dto/validateUser.dto';
import { UserAuthGuard } from '../guards/user-auth/user-auth.guard';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() validateUserDto: ValidateUserDto) {
    const user = this.authService.validateUser(validateUserDto);
    return user;
  }
  @Get('userData')
  @UseGuards(UserAuthGuard)
  getUserData(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }
}
