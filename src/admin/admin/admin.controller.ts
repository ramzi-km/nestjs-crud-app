import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

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
    if (!isValid) throw new HttpException('Invalid', HttpStatus.BAD_REQUEST);
    const user = await this.adminService.getUserById(userId);
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return user;
  }
  @Patch('user/:userId')
  async updateUser(
    @Body()
    updateUserDto: UpdateUserDto,
    @Param('userId') userId: string,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid) throw new HttpException('Invalid', HttpStatus.BAD_REQUEST);
    const updatedUser = await this.adminService.updateUser(
      userId,
      updateUserDto,
    );
    if (!updatedUser)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return updatedUser;
  }

  @Delete('user/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid) throw new HttpException('Invalid', HttpStatus.BAD_REQUEST);
    const deletedUser = await this.adminService.deleteUser(userId);
    if (!deletedUser)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return { message: 'success' };
  }
}
