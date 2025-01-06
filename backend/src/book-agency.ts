import { NestFactory, } from '@nestjs/core';
import { AppModule } from './app.module';
import { createMyLogger } from './global/logger';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { AppExceptionFilter } from './global/exceptions/exception-filter';

dotenv.config()
export const isLocalEnv = process.env.LOCAL_ENV === 'true'
export const globalLogger = new Logger('GLOBAL')

async function bootstrap() {

  
  const app = await NestFactory.create(AppModule, {
    logger: createMyLogger()
  })

  app.useGlobalFilters(new AppExceptionFilter());

  globalLogger.warn('isLocalEnv ' + isLocalEnv)

  const port = process.env.PORT ?? 3000
  globalLogger.log(`Listening on port ${port}`)
  await app.listen(port);
}
bootstrap();
