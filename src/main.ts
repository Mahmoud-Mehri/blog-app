import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AllExceptionFilter } from './common/middlewares/exception.filter';
import { CustomValidationPipe } from './common/middlewares/validation.pipe';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule, { logger: logger });
  app.useGlobalPipes(
    new CustomValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter());
  const port = process.env.PORT ? process.env.PORT : 3000;

  await app.listen(port).then(
    () => {
      logger.log(`App is listening on port ${port}`);
    },
    (err) => {
      logger.error(`Error on initializing App on port ${port}: ${err}`);
    },
  );
}
bootstrap();
