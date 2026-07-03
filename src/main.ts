import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /**
   * Set a global prefix for all API routes
   * All routes will now start with api/v1
   */
  app.setGlobalPrefix('/api');

  // Enable Version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  /**
   * Swagger API documentation configuration:
   */
  const config = new DocumentBuilder()
    .setTitle('Medico—Pharmacy E-Commerce Platform Backend Api')
    .setDescription(
      'Nest Medico—Pharmacy E-Commerce Platform Backend Api Documentation',
    )
    .addServer('http://localhost:5000/api/v1')
    .setTermsOfService('http://localhost:5000/api/v1/terms-of-conditions')
    .setVersion('1.0.0')
    // .addTag('nest-nest-starter-api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/swagger', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationSorter: 'alpha',
    },
    customSiteTitle: 'Medico—Pharmacy E-Commerce Platform Backend Api',
  });

  // Global Intercerptor (for class-transformer)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());

  // CORS Configaration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://medico-e-commerce-website-next-js-f.vercel.app',
      configService.getOrThrow<string>('FRONTEND_URL'),
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Disposition', 'Content-Type', 'Content-Length'],
  });

  const PORT = configService.get<number>('SERVER_PORT') || 5000;

  await app.listen(PORT);

  console.log(`Application is running on: ${await app.getUrl()}/api/v1`);
  console.log(`Swagger UI available at: ${await app.getUrl()}/api/v1`);
}
void bootstrap();
