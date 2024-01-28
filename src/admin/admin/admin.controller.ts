import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/CreateUser.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }
  @Get('user/:userId')
  async getUserById(@Param('userId') userId: string) {
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const user = await this.adminService.getUserById(userId);
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return user;
  }
}
