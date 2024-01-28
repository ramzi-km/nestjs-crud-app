import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/CreateUser.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }
}
