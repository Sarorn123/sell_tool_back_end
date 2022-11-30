import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';


////////////////////////////////////////////////
////////////////////////////////////////////////
////////////// Ry Sarorn Sell Tool Api /////////
////////////////////////////////////////////////
////////////////////////////////////////////////

const corsOptions ={
  origin:'https://nextjs-sell-tool.vercel.app', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

async function initApp() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors(corsOptions);
  app.setGlobalPrefix("/api/v1")
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 5000, () =>{
    console.log("Server Is Running On Port = "+process.env.PORT)
  });
  // await app.listen(process.env.PORT);
}
initApp();
