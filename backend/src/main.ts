
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './comun/http-exception.filter';
import { httpLogger } from './comun/http-logger';
import { opcionesTls } from './comun/tls';

export function configureApi(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.use(httpLogger);
  app.useGlobalFilters(new HttpExceptionFilter());
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    ...(process.env.RENDER ? {} : { httpsOptions: opcionesTls() }),
  });

configureApi(app);

app.enableCors({
  origin: 'https://gymtrack-roan.vercel.app',
  credentials: true,
});

app.enableShutdownHooks();

  await app.listen(
    Number(process.env.PORT || 3000),
    process.env.RENDER ? '0.0.0.0' : 'localhost',
  );

  console.info('API GymTrack iniciada correctamente.');
}

if (require.main === module) {
  bootstrap().catch(() => {
    console.error(
      'No se pudo iniciar NestJS. Revisa la configuración y PostgreSQL.',
    );
    process.exitCode = 1;
  });
}
