import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from 'src/admin/admin/dto/CreateUser.dto';
import { ValidateUserDto } from '../dto/validateUser.dto';
import { RoleGuard } from '../guards/role/role.guard';
import { UserAuthGuard } from '../guards/user-auth/user-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    const res = this.authService.userSignup(createUserDto);
    return res;
  }

  @Post('login')
  login(@Body() validateUserDto: ValidateUserDto) {
    const res = this.authService.validateUser(validateUserDto);
    return res;
  }

  @Post('adminlogin')
  adminLogin(@Body() validateUserDto: ValidateUserDto) {
    const res = this.authService.validateAdmin(validateUserDto);
    return res;
  }

  @Roles('user')
  @UseGuards(UserAuthGuard, RoleGuard)
  @Get('userData')
  getUserData(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }
}
