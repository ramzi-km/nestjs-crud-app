import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/admin/admin/dto/CreateUser.dto';
import { Admin } from 'src/schemas/Admin.schema';
import { User } from 'src/schemas/User.schema';
import { ValidateUserDto } from '../dto/validateUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}
  async userSignup(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = newUser.save();

    const userWithoutPassword = await this.userModel
      .findById((await savedUser)._id)
      .select('-password -__v')
      .lean();
    const token = this.jwtService.sign({
      id: userWithoutPassword._id,
      role: 'user',
    });

    return { token, user: userWithoutPassword };
  }

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
      return { token, user: userWithoutPassword };
    } else {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
  }
  async validateAdmin({ email, password }: ValidateUserDto) {
    const admin = await this.adminModel.findOne({ email });
    if (!admin)
      throw new HttpException('Admin doesnt exist!', HttpStatus.NOT_FOUND);
    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      const adminWithoutPassword = await this.adminModel
        .findById(admin._id)
        .select('-password -__v');
      const token = this.jwtService.sign({
        id: adminWithoutPassword.id,
        role: 'admin',
      });
      return { token, admin: adminWithoutPassword };
    } else {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(userId: string) {
    return await this.userModel.findById(userId).select('-password -__v');
  }
}
