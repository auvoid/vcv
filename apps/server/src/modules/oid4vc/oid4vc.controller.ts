import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeController,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { wsServer } from '../../main';
import { IdentityService } from '../../services/identity.service';
import { UserSession } from '../../decorators/UserSession';
import { Session, User } from '../../entities';
import { SiopOfferService } from './siopOffer.service';
import { CredOfferService } from './credOffer.service';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../users/sessions.service';
import {
  SiopOfferDTO,
  TokenResponseDTO,
  TokenRequestDTO,
  CredOfferDTO,
  BaseCredOfferDTO,
  SiopRequestDTO,
} from '@repo/dtos';
import { DataSource } from 'typeorm';
import { Serialize } from 'src/middlewares/interceptors/serialize.interceptors';
import { PresentationDefinitionV2, Rules } from '@sphereon/pex-models';
import { IsAuthenticated } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators';
import { CredentialsService } from '../credential/credential.service';
import { ExperiencesService } from '../cv/experience.service';
import { getResolver, validateJsonWebToken } from 'src/utils';
import { Request } from 'express';
import { v4 as uuid } from 'uuid';

const presentationDefinition = {
  id: 'all-credentials-request',
  purpose:
    "To gather all available verifiable credentials from the holder's wallet",
  input_descriptors: [
    {
      id: `all-vcs`,
      constraints: {
        fields: [
          {
            path: ['$.vc.type'],
            filter: {
              type: 'array',
              contains: {
                type: 'string',
                pattern: 'VerifiableCredential',
              },
            },
          },
        ],
      },
    },
  ],
};

@ApiTags('OpenID')
@ApiExcludeController()
@Controller('oid4vc')
export class Oid4vcController {
  constructor(
    private identityService: IdentityService,
    private siopOfferService: SiopOfferService,
    private credOfferService: CredOfferService,
    private credentialsService: CredentialsService,
    private usersService: UsersService,
    private experienceService: ExperiencesService,
  ) {}

  @Serialize(SiopOfferDTO)
  @ApiOkResponse({ type: SiopOfferDTO })
  @IsAuthenticated()
  @Get('/pex')
  async newSiopRequest(
    @UserSession() session: Session,
    @CurrentUser() user: User,
  ) {
    const state = `${user.id}::${session.id}`;
    const siopRequest = await (
      await this.identityService.getAdminDid()
    ).rp.createRequest({
      state,
      requestBy: 'reference',
      requestUri: new URL(
        `/api/oid4vc/siop/${session.id}`,
        process.env.PUBLIC_BASE_URI,
      ).toString(),
      responseType: 'vp_token',
      presentationDefinition,
    });

    const offerExists = await this.siopOfferService.findById(session.id);
    if (offerExists) {
      await this.siopOfferService.findByIdAndUpdate(session.id, {
        request: siopRequest.request,
      });
    } else {
      await this.siopOfferService.create({
        id: session.id,
        request: siopRequest.request,
      });
    }
    return siopRequest;
  }

  @ApiOkResponse({ type: String })
  @ApiNotFoundResponse({ type: NotFoundException })
  @Get('/siop/:id')
  async getSiopRequestById(@Param('id') id: string) {
    const { request } = await this.siopOfferService.findById(id);
    return request;
  }

  @Serialize(TokenResponseDTO)
  @Post('/token')
  @ApiOkResponse({ type: TokenResponseDTO })
  @ApiNotFoundResponse({ type: NotFoundException })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorException })
  async tokenEndpoint(@Body() body: TokenRequestDTO) {
    const { issuer } = await this.identityService.getAdminDid();
    const response = await issuer.createTokenResponse(body);
    return response;
  }

  @Serialize(CredOfferDTO)
  @ApiOkResponse({ type: CredOfferDTO })
  @ApiNotFoundResponse({ type: NotFoundException })
  @IsAuthenticated()
  @Get('/dummy')
  async createDummyCredentialsOffer(
    @UserSession() session: Session,
    @CurrentUser() user: User,
  ) {
    const { issuer } = await this.identityService.getAdminDid();

    const id = session.id;
    const demoCredentials = ['University Degree', 'First Aid Training'];
    const offer = await issuer.createCredentialOffer(
      {
        credentials: demoCredentials,
        requestBy: 'reference',
        credentialOfferUri: new URL(
          `/api/oid4vc/offers/${id}`,
          process.env.PUBLIC_BASE_URI,
        ).toString(),
        pinRequired: false,
      },
      {
        state: `${user.id}::${session.id}`,
      },
    );
    const offerExists = await this.credOfferService.findById(id);
    if (!offerExists) {
      await this.credOfferService
        .create({ id, offer: offer.offer })
        .catch(() => null);
    } else {
      await this.credOfferService.findByIdAndUpdate(id, {
        offer: offer.offer,
      });
    }
    return offer;
  }

  @Serialize(CredOfferDTO)
  @ApiOkResponse({ type: CredOfferDTO })
  @ApiNotFoundResponse({ type: NotFoundException })
  @Get('/credentials/:token')
  async createCredentialOffer(
    @Param('token') token: string,
    @UserSession() session: Session,
  ) {
    const { payload, expired } = validateJsonWebToken(token);
    if (expired || !payload) throw new BadRequestException();
    const { experienceId } = await payload;
    const experience = await this.experienceService.findById(experienceId, {
      cv: {
        user: true,
      },
    });
    if (experience.status !== 'approved')
      throw new BadRequestException('Experience Not Approved');
    const { issuer } = await this.identityService.getAdminDid();

    const credentialName = `Verifiable Experience`;
    const offer = await issuer.createCredentialOffer(
      {
        credentials: [credentialName],
        requestBy: 'reference',
        credentialOfferUri: new URL(
          `/api/oid4vc/offers/${experienceId}`,
          process.env.PUBLIC_BASE_URI,
        ).toString(),
        pinRequired: false,
      },
      {
        state: `${experienceId}::${session.id}`,
      },
    );
    const offerExists = await this.credOfferService.findById(experienceId);
    if (!offerExists) {
      await this.credOfferService
        .create({ id: experienceId, offer: offer.offer })
        .catch(() => null);
    } else {
      await this.credOfferService.findByIdAndUpdate(experienceId, {
        offer: offer.offer,
      });
    }
    return offer;
  }

  @Serialize(BaseCredOfferDTO)
  @Get('/offers/:id')
  @ApiOkResponse({ type: BaseCredOfferDTO })
  @ApiNotFoundResponse({ type: NotFoundException })
  async getCredOffer(@Param('id') id: string) {
    const { offer } = await this.credOfferService.findById(id);
    return offer;
  }

  @Post('/credential')
  async sendCredential(@Req() req: Request) {
    const didJWT = await import('did-jwt');
    const token = req.headers.authorization?.split('Bearer ')[1];
    const resolver = await getResolver();
    if (!token) throw new UnauthorizedException('Bad Token');
    const { payload } = await didJWT.verifyJWT(token, {
      policies: { aud: false },
      resolver,
    });
    const [experienceId, sessionId] = payload.state.split('::');
    const experience = await this.experienceService.findById(experienceId, {
      cv: { user: true },
    });
    if (experience.status !== 'approved')
      throw new BadRequestException('experience not approved');
    const identity = await this.identityService.getAdminDid();

    const did = await identity.issuer.validateCredentialsResponse({
      token,
      proof: req.body.proof.jwt,
    });

    const verifiableCredential = await identity.account.credentials.create({
      recipientDid: did,
      body: {
        'Company Name': experience.companyName,
        'Company Website': experience.companyUrl,
        'Job Title': experience.jobTitle,
        'Start Date': experience.startDate,
        'End Date': experience.endDate ?? 'Present',
        'Verified By': experience.reference,
      },
      id: new URL(
        `/verify/${experience.id}`,
        process.env.PUBLIC_CLIENT_URI,
      ).toString(),
      keyIndex: 0,
      type: `Verifiable Experience`,
    });
    const decodedVc = await identity.rp.validateJwt(verifiableCredential.cred);
    const credential = await this.credentialsService.create({
      name: decodedVc.vc.type[1] ?? decodedVc.vc.type[0],
      decoded: decodedVc,
      raw: verifiableCredential.cred,
      user: experience.cv.user,
      type: 'experience',
      cvs: [experience.cv],
    });

    const response = await identity.issuer.createSendCredentialsResponse({
      credentials: [verifiableCredential.cred],
    });

    await this.experienceService.findByIdAndDelete(experience.id);
    return response;
  }

  @Post('/credentials')
  async sendBatchCredentials(@Req() req: Request) {
    const didJWT = await import('did-jwt');
    const token = req.headers.authorization?.split('Bearer ')[1];
    const resolver = await getResolver();
    if (!token) throw new UnauthorizedException('Bad Token');
    const { payload } = await didJWT.verifyJWT(token, {
      policies: { aud: false },
      resolver,
    });
    const { state } = payload;
    console.log(req.body);

    const identity = await this.identityService.getAdminDid();

    const did = await identity.issuer.validateCredentialsResponse({
      token,
      proof: req.body.credential_requests[0].proof.jwt,
    });
    const id = uuid();

    const universityDegree = await identity.account.credentials.create({
      recipientDid: did,
      body: {
        'Issued By': 'Example University',
        GPA: 5,
        'Student ID': 'S32404333',
        Course: 'Masters in Cryptography',
        'Course Completed': '12 Sept 2023',
        enrichment: {
          logo_uri: new URL(
            '/images/university.webp',
            process.env.PUBLIC_CLIENT_URI,
          ).toString(),
        },
      },
      id: new URL(`/verify/${id}`, process.env.PUBLIC_CLIENT_URI).toString(),
      keyIndex: 0,
      type: `University Degree`,
    });
    const firstAidTraining = await identity.account.credentials.create({
      recipientDid: did,
      body: {
        'Issued By': 'Health and Training Board',
        'Training Completion': '02 Sept 2023',
        enrichment: {
          logo_uri: new URL(
            '/images/first-aid.webp',
            process.env.PUBLIC_CLIENT_URI,
          ).toString(),
        },
      },
      id: new URL(
        `/verify/${uuid()}`,
        process.env.PUBLIC_CLIENT_URI,
      ).toString(),
      keyIndex: 0,
      type: `First Aid Training`,
    });
    const [userId, sessionId] = state.split('::');
    const user = await this.usersService.findById(userId);

    for (const cred of [firstAidTraining, universityDegree]) {
      const decodedVc = await identity.rp.validateJwt(cred.cred);
      const credential = await this.credentialsService.create({
        name: decodedVc.vc.type[1] ?? decodedVc.vc.type[0],
        decoded: decodedVc,
        raw: cred.cred,
        user: user,
        type:
          decodedVc.vc.type[1] === 'University Degree'
            ? 'education'
            : 'certification',
      });
    }

    const response = await identity.issuer.createSendCredentialsResponse({
      credentials: [universityDegree.cred, firstAidTraining.cred],
    });

    wsServer.broadcast(sessionId, { proceed: true });
    return response;
  }

  @ApiBody({ type: SiopRequestDTO })
  @Post('/auth')
  async verifyAuthResponse(@Body() body: Record<string, any>) {
    const { state } = body;
    if (typeof body.presentation_submission === 'string')
      body.presentation_submission = JSON.parse(body.presentation_submission);
    const { id_token: idToken, vp_token: vpToken } = body;
    const { rp } = await this.identityService.getAdminDid();
    if (idToken) {
      await rp.verifyAuthResponse(body);
      // const { iss } = await rp.validateJwt(idToken);
    } else {
      await rp.verifyAuthResponse(body, presentationDefinition);
      const {
        vp: { verifiableCredential },
      } = await rp.validateJwt(vpToken);
      const [userId, sessionId] = state.split('::');
      const user = await this.usersService.findById(userId);
      if (!user) throw new UnauthorizedException();
      const credentialsParsed = await Promise.all(
        verifiableCredential.map(async (raw) => {
          const decodedVc = await rp.validateJwt(raw);
          return {
            name: decodedVc.vc.type[1] ?? decodedVc.vc.type[0],
            decoded: decodedVc,
            raw,
            user,
          };
        }),
      );
      const credentials =
        await this.credentialsService.createBulk(credentialsParsed);
      console.log(credentials);

      wsServer.broadcast(sessionId, { success: true });
    }
  }
}
