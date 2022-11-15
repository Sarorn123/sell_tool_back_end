import { Module } from '@nestjs/common';
import { BuyService } from './buy.service';
import { PrismaModule } from '../Prisma/prisma.module';
import { ImageUploadModule } from '../ImageUpload/imageUpload.module';
import { BuyController } from './buy.controller';
import { NotificationModule } from '../Notification/notification.module';

@Module({
  imports: [PrismaModule, ImageUploadModule, NotificationModule],
  controllers: [BuyController],
  providers: [BuyService],
})
export class BuyModule {}
