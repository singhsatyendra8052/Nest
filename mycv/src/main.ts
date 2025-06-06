import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');
// import {cookieSession} from 'cookie-session'
// import {cookiesession} doesn't work properly with nest
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   cookieSession({
  //     keys: ['d873hsnpsnd'],
  //   }),
  // );

  app.use(cookieParser());
  app.use(
    session({
      secret: '4bfhe9bfvt',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }, // adjust as needed
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
