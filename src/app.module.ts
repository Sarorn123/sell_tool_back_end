import { Module } from '@nestjs/common';
import { ProductModule } from './Product/product.module';
import { PrismaModule } from './Prisma/prisma.module';
import { UserModule } from './User/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule , ProductModule, UserModule, AuthModule],
})
export class AppModule {}
