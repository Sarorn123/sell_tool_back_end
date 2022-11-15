import { Module } from '@nestjs/common';
import { PrismaModule } from '../Prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ImageUploadModule } from '../ImageUpload/imageUpload.module';

@Module({
  imports: [PrismaModule, ImageUploadModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
