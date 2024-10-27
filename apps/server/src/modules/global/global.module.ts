import { Global, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { IdentityService } from '../../services/identity.service';

@Global()
@Module({
  imports: [UsersModule],
  providers: [IdentityService],
  exports: [IdentityService],
  controllers: [],
})
export class GlobalModule {}
