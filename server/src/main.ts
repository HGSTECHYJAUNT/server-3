import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      transform:true
    })
  )
    console.log("app is listening on port", process.env.PORT)
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
