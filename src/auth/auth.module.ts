import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/schemas/Admin.schema';
import { User, UserSchema } from 'src/schemas/User.schema';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './stratagies/jwt.strategy';

@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '3d' },
        }),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
          {
            name: Admin.name,
            schema: AdminSchema,
          },
        ]),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
      module: AuthModule,
    };
  }
}
