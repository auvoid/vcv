import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CVsService } from './cv.service';
import { IsAuthenticated } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators';
import { User } from 'src/entities';
import { CreateCVDto, CreateExperienceDTO } from '@repo/dtos';
import { In } from 'typeorm';
import { CredentialsService } from '../credential/credential.service';
import { ExperiencesService } from './experience.service';
import { EmailService } from '../email/email.service';
import { validateJsonWebToken } from 'src/utils';

@Controller('cv')
export class CVController {
  constructor(
    private readonly cvsService: CVsService,
    private readonly credentialsService: CredentialsService,
    private readonly experienceService: ExperiencesService,
    private readonly emailService: EmailService,
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

  @Patch('/:id')
  @IsAuthenticated()
  async updateCv(
    @Body() body: CreateCVDto,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const { credentials: credentialIds, ...rest } = body;
    const credentials = await this.credentialsService.findMany({
      id: In(credentialIds),
    });
    const _cvFound = await this.cvsService.findById(id, { user: true });
    if (_cvFound.user.id !== user.id) throw new NotFoundException();
    const cv = await this.cvsService.findByIdAndUpdate(id, {
      ...rest,
      credentials,
    });
    return cv;
  }

  @Delete('/:id')
  @IsAuthenticated()
  async deleteCvById(@Param('id') id: string, @CurrentUser() user: User) {
    const cv = await this.cvsService.findById(id, { user: true });
    if (cv.user.id !== user.id) throw new NotFoundException();
    await this.cvsService.findByIdAndDelete(id);
  }

  @Get()
  @IsAuthenticated()
  async getAllUserCvs(@CurrentUser() user: User) {
    return this.cvsService.findMany(
      { user: { id: user.id } },
      { credentials: true },
    );
  }

  @Get('/:id')
  async getUserCVById(@Param('id') id: string, @CurrentUser() user: User) {
    const cv = await this.cvsService.findById(id, {
      user: true,
      credentials: true,
      experiences: true,
    });
    return cv;
  }

  @Get(`/experience/:token`)
  async getExperienceData(@Param('token') token: string) {
    const { payload, expired } = validateJsonWebToken(token);
    if (expired || !payload) throw new BadRequestException();

    const experience = await this.experienceService.findById(
      payload.experienceId,
      { cv: true },
    );

    if (experience.status !== 'pending')
      throw new BadRequestException('This token is invalid');

    return experience;
  }

  @Post(`/experience/:token`)
  async updateExperienceData(
    @Param('token') token: string,
    @Body() body: { approved: boolean },
  ) {
    const { payload, expired } = validateJsonWebToken(token);
    if (expired || !payload) throw new BadRequestException();

    const experience = await this.experienceService.findById(
      payload.experienceId,
      {
        cv: {
          user: true,
        },
      },
    );

    if (experience.status !== 'pending')
      throw new BadRequestException('This token is invalid');

    await this.experienceService.findByIdAndUpdate(payload.experienceId, {
      status: body.approved ? 'approved' : 'rejected',
    });

    if (body.approved) {
      this.emailService.sendBatchCredentials(experience);
    }
    return experience;
  }

  @Post('/:id/experience')
  @IsAuthenticated()
  async createNewExperience(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() body: CreateExperienceDTO,
  ) {
    const cv = await this.cvsService.findById(id, { user: true });
    if (cv.user.id !== user.id) throw new NotFoundException();
    const tld = new URL(body.companyUrl).host;
    if (tld !== body.reference.split('@')[1])
      throw new BadRequestException(
        "The reference email shall be from the company URL's TLD",
      );

    const experience = await this.experienceService.create({ ...body, cv });
    await this.emailService.sendExperienceEmail(experience, cv);
    return experience;
  }

  @Get('/:id/experience')
  @IsAuthenticated()
  async getExperiences(@Param('id') id: string, @CurrentUser() user: User) {
    const cv = await this.cvsService.findById(id, { user: true });
    if (cv.user.id !== user.id) throw new NotFoundException();
    const experiences = await this.experienceService.findMany({
      cv: { id: id },
    });
    return experiences;
  }
}
