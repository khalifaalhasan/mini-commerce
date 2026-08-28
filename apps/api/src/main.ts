import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { PrismaExceptionFilter } from './common/filter/prisma-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { FilteredLogger, logConfig } from '@mini-commerce/logger';
import { mergeAuthDocs } from './modules/auth/auth-docs.util';
import { pinoHttp } from 'pino-http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    bufferLogs: true,
    bodyParser: false,
  });

  app.use(pinoHttp({
    ...logConfig.pinoHttp,
    autoLogging: true, 
  }));

  // app.enableCors({
  //   origin: '*', 
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });

  const port = process.env.PORT

  const config = new DocumentBuilder()
    .setTitle('Mini Commerce API')
    .setDescription('The core API documentation for Mini Commerce')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}/api`, 'Development Server')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const mergedDocument = await mergeAuthDocs(document);


  app.use(
    '/reference',
    apiReference({
      spec: {
        content: mergedDocument,
      },
      theme: 'purple', 
      layout: 'modern',
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useLogger(app.get(FilteredLogger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📖 API Reference available at: http://localhost:${port}/reference`);
}
bootstrap();
