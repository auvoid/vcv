import { forwardRef, Module } from '@nestjs/common';
import { Oid4vcController } from './oid4vc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredOffer, SiopOffer } from '../../entities';
import { SiopOfferService } from './siopOffer.service';
import { CredOfferService } from './credOffer.service';
import { UsersModule } from '../users/users.module';
import { CredentialsModule } from '../credential/credential.module';
import { CVModule } from '../cv/cv.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SiopOffer, CredOffer]),
    forwardRef(() => UsersModule),
    CredentialsModule,
    CVModule,
  ],
  controllers: [Oid4vcController],
  providers: [SiopOfferService, CredOfferService],
  exports: [SiopOfferService, CredOfferService],
})
export class Oid4vcModule {}
