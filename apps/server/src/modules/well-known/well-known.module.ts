import { Module } from '@nestjs/common';
import { WellKnownController } from './well-known.controller';

@Module({
  imports: [],
  controllers: [WellKnownController],
})
export class WellKnownModule {}
