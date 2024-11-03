import { Body, Controller, Get, Post } from '@nestjs/common';
import { CVsService } from './cv.service';
import { IsAuthenticated } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators';
import { User } from 'src/entities';
import { CreateCVDto } from '@repo/dtos';
import { In } from 'typeorm';
import { CredentialsService } from '../credential/credential.service';

@Controller('cv')
export class CVController {
  constructor(
    private readonly cvsService: CVsService,
    private readonly credentialsService: CredentialsService,
  ) {}

  @Post()
  @IsAuthenticated()
  async createCv(@Body() body: CreateCVDto, @CurrentUser() user: User) {
    const { credentials: credentialIds, ...rest } = body;
    const credentials = await this.credentialsService.findMany({
      id: In(credentialIds),
    });
    const cv = await this.cvsService.create({ ...rest, credentials, user });
    return cv;
  }

  @Get()
  @IsAuthenticated()
  async getAllUserCvs(@CurrentUser() user: User) {
    return this.cvsService.findMany({ user: { id: user.id } });
  }
}
