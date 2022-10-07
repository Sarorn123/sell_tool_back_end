import {  Injectable } from '@nestjs/common';
import {  Storage } from "@google-cloud/storage";

@Injectable()
export class ImageUploadService {

  private storage: Storage;
  private bucket = "";

  constructor() {
    const keyFilename = "cloudKey.json";
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename
    });

    this.bucket = process.env.BUCKET;
  }

  async saveImage(
    path: string,
    media: Buffer,
  ): Promise<string> {
    const file = this.storage.bucket(this.bucket).file(path);
    const stream = file.createWriteStream();
    stream.on("finish", async () => {
      console.log("Upload Success");
    });
    stream.end(media);
    return path;
  }

  async deleteImage(path: string) {
    await this.storage
      .bucket(process.env.BUCKET)
      .file(path)
      .delete({ ignoreNotFound: true });
  }

  getImageUrl (path: string): string{
    return `${process.env.GOOGLE_CLOUD_URL}/${process.env.BUCKET}/${path}`;
  }

  validateImage (file: Express.Multer.File): {accept: boolean, message: string}{
    let accept = true;
    let message = "";
    if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg'){
      accept = false;
      message = "File Not Support !"
    }
    if(file.size > 10000000){
      accept = false;
      message = "File Must Smaller Than 10M"
    }
    return {accept, message};
  }
}