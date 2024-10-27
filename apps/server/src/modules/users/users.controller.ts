import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SessionsService } from './sessions.service';
import { EmailService } from '../email/email.service';
import { createJsonWebToken, validateJsonWebToken } from '../../utils/jwt';
import { IsAuthenticated } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/user';
import { User } from '../../entities/user';
import {
  CreateUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
  UserDTO,
} from '@repo/dtos';
import { Serialize } from '../../interceptors/serialize';
import { ApiCookieAuth } from '@nestjs/swagger';
import { UserSession } from '../../decorators';
import { Session } from '../../entities';
import { errors } from '../../errors';
import type { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private sessionService: SessionsService,
    private emailService: EmailService,
  ) {}

  @Post()
  @Serialize(UserDTO)
  async createNewUser(@Body() body: CreateUserDTO) {
    const { email, password } = body;
    const _userExists = await this.userService.findOne({ email });
    if (_userExists) throw new BadRequestException('email already exists');

    const user = await this.userService.create({
      email,
      password,
    });
    return user;
  }

  @Get()
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('/login')
  async loginUser(@Body() body: LoginUserDTO) {
    const { email, password } = body;
    const user = await this.userService.findOne({ email });
    if (!(await user.verifyPassword(password))) throw new BadRequestException();
    return {
      token: createJsonWebToken({ scope: 'auth', userId: user.id }, '1y'),
    };
  }

  @Patch()
  @IsAuthenticated()
  @ApiCookieAuth()
  async patchCurrentUser(
    @CurrentUser() user: User,
    @Body() body: Partial<User>,
  ) {
    return await this.userService.findByIdAndUpdate(user.id, body);
  }

  @Get('/logout')
  @IsAuthenticated()
  @ApiCookieAuth()
  async logoutUser(
    @Res({ passthrough: true }) res: Response,
    @UserSession() session: Session,
  ) {
    res.cookie('accessToken', '', {
      maxAge: 0,
      httpOnly: true,
    });
    res.cookie('refreshToken', '', {
      maxAge: 0,
      httpOnly: true,
    });
    await this.sessionService.findByIdAndDelete(session.id);
    return;
  }

  @Get('/')
  @IsAuthenticated()
  @ApiCookieAuth()
  async getCurrentUser(@CurrentUser() user: User) {
    return {
      ...user,
    };
  }

  @IsAuthenticated()
  @ApiCookieAuth()
  @Get('verify-email')
  async verifyEmail(@CurrentUser() user: User) {
    const isAlreadyVerified = (await this.getCurrentUser(user)).emailVerified;

    if (isAlreadyVerified)
      throw new ConflictException(errors.users.ALREADY_VERIFIED);
    await this.emailService.sendUserEmailVerification({ user });
  }

  @IsAuthenticated()
  @ApiCookieAuth()
  @Post('verify-email')
  async verifyEmailToken(
    @Body() body: { token: string },
    @CurrentUser() user: User,
  ) {
    const { payload, expired } = validateJsonWebToken(body.token);
    console.log(payload, expired);
    if (expired) throw new BadRequestException(errors.users.EXPIRED_TOKEN);
    if (payload.scope !== 'email-verification')
      throw new BadRequestException(errors.users.INVALID_SCOPE);
    if (payload.context !== 'user')
      throw new BadRequestException(errors.users.INVALID_CONTEXT);
    if (payload.userId !== user.id)
      throw new BadRequestException(errors.users.BAD_EMAIL_VERIFICATION);

    await this.userService.findByIdAndUpdate(user.id, {
      emailVerified: true,
    });
  }

  @Serialize(UserDTO)
  async updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDTO) {
    const { password, oldPassword } = body;
    const isValidPassword = await user.verifyPassword(oldPassword);
    if (!isValidPassword) throw new BadRequestException();
    const updated = await this.userService.findByIdAndUpdate(user.id, {
      password,
    });
    return updated;
  }
}
