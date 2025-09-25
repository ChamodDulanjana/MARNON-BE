import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';

const VITE_WEB = process.env.VITE_WEB;
const VITE_ADMIN_PANEL = process.env.VITE_ADMIN_PANEL;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //global exception handler
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS
  app.enableCors({
    origin: [VITE_WEB, VITE_ADMIN_PANEL], // allow both frontends
    credentials: true, // Allow cookies to be sent
  });

  // Use cookie parser middleware
  app.use(cookieParser());

  // Increase payload size limit
  app.use(bodyParser.json({ limit: '50mb' })); // Adjust size as needed
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  //common url path
  app.setGlobalPrefix(String(process.env.SERVER_URL));

  // Port to listen on
  await app.listen(Number(process.env.PORT));
}
bootstrap();
