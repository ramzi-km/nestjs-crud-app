import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { ValidateUserDto } from '../dto/validateUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: ValidateUserDto) {
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new HttpException('User doesnt exist!', HttpStatus.NOT_FOUND);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const userWithoutPassword = await this.userModel
        .findById(user._id)
        .select('-password -__v');
      const token = this.jwtService.sign({
        id: userWithoutPassword.id,
        role: 'user',
      });
      return { token, userWithoutPassword };
    } else {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(userId: string) {
    return await this.userModel.findById(userId).select('-password -__v');
  }
}
