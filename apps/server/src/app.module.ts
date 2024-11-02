import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { UsersModule } from './modules/users/users.module';
import { Oid4vcModule } from './modules/oid4vc/oid4vc.module';
import { EmailModule } from './modules/email/email.module';
import { GlobalModule } from './modules/global/global.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    Oid4vcModule,
    EmailModule,
    GlobalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
