import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(createUserDto: CreateUserDto) {
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

    return userWithoutPassword;
  }

  getUsers() {
    return this.userModel.find().select('-password -__v');
  }

  getUserById(userId: string) {
    return this.userModel.findById(userId).select('-password -__v');
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const fieldsToAvoid = ['_id', '__v', 'email'];

    const updateObject: UpdateUserDto = {};
    for (const field in updateUserDto) {
      if (
        updateUserDto[field] !== undefined &&
        !fieldsToAvoid.includes(field)
      ) {
        updateObject[field] = updateUserDto[field];
      }
    }
    return this.userModel
      .findByIdAndUpdate(userId, updateObject, {
        new: true,
      })
      .select('-password -__v');
  }

  deleteUser(userId: string) {
    return this.userModel.findByIdAndDelete(userId);
  }
}
