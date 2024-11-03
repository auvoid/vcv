import {
  Body,
  Controller,
  Get,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { CredentialsService } from './credential.service';
import { IsAuthenticated } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators';
import { User } from 'src/entities';

@Controller('credentials')
export class CredentialController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Get()
  @IsAuthenticated()
  async getAllCredentials(@CurrentUser() user: User) {
    return this.credentialsService.findMany({ user: { id: user.id } });
  }

  @Patch()
  @IsAuthenticated()
  async updateCredentialAssignments(
    @CurrentUser() user: User,
    @Body() body: Record<string, 'education' | 'certification' | null>,
  ) {
    for (const credId of Object.keys(body)) {
      const credential = await this.credentialsService.findById(credId, {
        user: true,
      });
      if (credential.user.id !== user.id) throw new UnauthorizedException();
      console.log(body[credId]);
      await this.credentialsService.findByIdAndUpdate(credId, {
        type: body[credId],
      });
    }
  }
}
