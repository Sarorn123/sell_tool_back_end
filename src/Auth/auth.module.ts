import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../Auth/constants';
import { UserModule } from '../User/user.module';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../Prisma/prisma.module';
import { AuthController } from './auth.controller';
import { ImageUploadModule } from 'src/ImageUpload/imageUpload.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60h' },
    }),
    ImageUploadModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}