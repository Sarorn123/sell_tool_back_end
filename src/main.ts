import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function initApp() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api/v1")
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 5000);
  // await app.listen(process.env.PORT);
}
initApp();
