import { Module } from '@nestjs/common';
import { ProductModule } from './Product/product.module';
import { PrismaModule } from './Prisma/prisma.module';
import { UserModule } from './User/user.module';
import { AuthModule } from './Auth/auth.module';
import { BuyModule } from './Buy/buy.module';
import { NotificationModule } from './Notification/notification.module';

@Module({
  imports: [
    PrismaModule , 
    ProductModule,
    UserModule, 
    AuthModule,
    BuyModule,
    NotificationModule
  ],
})
export class AppModule {}
