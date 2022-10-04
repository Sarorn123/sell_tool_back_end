import { Module } from '@nestjs/common';
import { ProductModule } from './Product/product.module';
import { PrismaModule } from './Prisma/prisma.module';

@Module({
  imports: [PrismaModule , ProductModule],
})
export class AppModule {}
