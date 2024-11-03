import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from 'src/entities/credential';
import { CredentialsService } from './credential.service';
import { CredentialController } from './credential.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Credential])],
  providers: [CredentialsService],
  controllers: [CredentialController],
  exports: [CredentialsService],
})
export class CredentialsModule {}
