import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CV } from 'src/entities/cv';
import { CVsService } from './cv.service';
import { CVController } from './cv.controller';
import { CredentialsModule } from '../credential/credential.module';
import { Experience } from 'src/entities/experience';
import { ExperiencesService } from './experience.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CV, Experience]),
    CredentialsModule,
    EmailModule,
  ],
  providers: [CVsService, ExperiencesService],
  controllers: [CVController],
  exports: [],
})
export class CVModule {}
