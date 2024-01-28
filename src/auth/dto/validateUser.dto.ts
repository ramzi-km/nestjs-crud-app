import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateUserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
