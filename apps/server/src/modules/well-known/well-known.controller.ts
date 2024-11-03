import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { IdentityService } from 'src/services/identity.service';

@Controller()
export class WellKnownController {
  constructor(private identityService: IdentityService) {}

  @Get('/.well-known/openid-credential-issuer')
  async getIssuerMetadata(@Param('did') did: string) {
    const issuerDid = await this.identityService.getAdminDid();
    const supportedCreds = [
      {
        name: 'Verifiable Experience',
        type: ['Verifiable Experience'],
        display: [
          {
            name: 'Verifiable Experience',
          },
        ],
      },
    ];

    return issuerDid.issuer.getIssuerMetadata(supportedCreds);
  }

  @Get('/.well-known/oauth-authorization-server')
  async getAuthServerMetadata() {
    const issuerDid = await this.identityService.getAdminDid();
    return issuerDid.issuer.getOauthServerMetadata();
  }
}
