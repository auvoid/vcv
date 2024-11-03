import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { UsersModule } from './modules/users/users.module';
import { Oid4vcModule } from './modules/oid4vc/oid4vc.module';
import { EmailModule } from './modules/email/email.module';
import { GlobalModule } from './modules/global/global.module';
import { CVModule } from './modules/cv/cv.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './guards/auth.guard';
import { WellKnownModule } from './modules/well-known/well-known.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    Oid4vcModule,
    EmailModule,
    GlobalModule,
    CVModule,

    WellKnownModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class AppModule {}
