import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../Prisma/prisma.module';


@Module({
  exports: [NotificationService],
  providers: [NotificationService],
  controllers: [NotificationController],
  imports: [PrismaModule]
})
export class NotificationModule {}
