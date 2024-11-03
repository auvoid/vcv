import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CV } from 'src/entities/cv';
import { CVsService } from './cv.service';
import { CVController } from './cv.controller';
import { CredentialsModule } from '../credential/credential.module';

@Module({
  imports: [TypeOrmModule.forFeature([CV]), CredentialsModule],
  providers: [CVsService],
  controllers: [CVController],
  exports: [],
})
export class CVModule {}
