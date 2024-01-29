import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ValidateUserDto } from '../dto/validateUser.dto';
import { RoleGuard } from '../guards/role/role.guard';
import { UserAuthGuard } from '../guards/user-auth/user-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() validateUserDto: ValidateUserDto) {
    const user = this.authService.validateUser(validateUserDto);
    return user;
  }

  @Post('adminlogin')
  adminLogin(@Body() validateUserDto: ValidateUserDto) {
    const user = this.authService.validateAdmin(validateUserDto);
    return user;
  }

  @Roles('user')
  @UseGuards(UserAuthGuard, RoleGuard)
  @Get('userData')
  getUserData(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }
}
