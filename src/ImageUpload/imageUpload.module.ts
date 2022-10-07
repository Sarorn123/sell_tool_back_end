import { Module } from '@nestjs/common';
import { ImageUploadService } from './imageUpload.service';

@Module({
  exports: [ImageUploadService],
  providers: [ImageUploadService],
})
export class ImageUploadModule {}
