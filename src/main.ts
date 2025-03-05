import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //global exception handler
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS
  app.enableCors();

  //common url path
  app.setGlobalPrefix(String(process.env.SERVER_URL));

  // Port to listen on
  await app.listen(Number(process.env.PORT));
}
bootstrap();
