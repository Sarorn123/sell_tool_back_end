import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from '../Prisma/prisma.module';
import { ImageUploadModule } from '../ImageUpload/imageUpload.module';

@Module({
  imports: [PrismaModule, ImageUploadModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
