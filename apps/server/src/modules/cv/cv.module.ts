import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CV } from 'src/entities/cv';
import { CVsService } from './cv.service';
import { CVController } from './cv.controller';
import { Credential } from 'src/entities/credential';
import { CredentialsService } from './credential.service';

@Module({
  imports: [TypeOrmModule.forFeature([CV, Credential])],
  providers: [CVsService, CredentialsService],
  controllers: [CVController],
  exports: [],
})
export class CVModule {}
