import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { WebSocketManager, initWebSocketManager } from './utils/websocket';
import { DataSource } from 'typeorm';
import { AppClusterService } from './services/cluster.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { apiReference } from '@scalar/nestjs-api-reference';

let app: INestApplication;
async function initializeApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.setGlobalPrefix('api', {
    exclude: [
      '/.well-known/did.json',
      '/.well-known/acme-challenge/:token',
      '/:did/.well-known/did.json',
      // '/:did/.well-known/oauth-authorization-server',
      // '/:did/.well-known/openid-credential-issuer',
    ],
  });
  const config = new DocumentBuilder()
    .setTitle('AuvoID')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
      },
      'API Key',
    )
    .addServer(
      new URL('/', process.env.PUBLIC_BASE_URI).toString().slice(0, -1),
    )
    .addCookieAuth('accessToken')
    .setDescription('AuvoID API')
    .setVersion('v0.3.1-beta')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/api/docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );
  app.enableCors({
    origin: function (origin, cb) {
      cb(null, true);
    },
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets/',
  });
  return app;
}

export let wsServer: WebSocketManager;

async function bootstrap() {
  app = await initializeApp();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  const server = app.getHttpServer();
  wsServer = initWebSocketManager(server);

  app.listen(1209);
}

export function getDataSource() {
  const dataSource = app.get<DataSource>(DataSource);
  return dataSource;
}

AppClusterService.clusterize(bootstrap);
