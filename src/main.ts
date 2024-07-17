import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerExceptionFilter } from './security/throttler-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT || 3000
  app.useStaticAssets('public/upload/', {
    prefix: '/public/upload/',
  });

  const options = new DocumentBuilder()
    .setTitle('OK OCE NET')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(helmet({
    crossOriginResourcePolicy: false
  }));

  // Rate Limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // limit tiap IP untuk 100 requests per windowMs
  }));

  app.useGlobalFilters(new ThrottlerExceptionFilter());

  app.enableCors();

  // Content Security Policy (CSP)
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'"
    );
    next();
  });

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });

  await app.listen(PORT);
}
bootstrap();