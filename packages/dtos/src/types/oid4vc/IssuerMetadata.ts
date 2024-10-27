import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class IssuerMetadataDto {
    @Expose()
    @ApiProperty()
    credential_issuer: string;

    @Expose()
    @ApiProperty()
    credential_endpoint: string;

    @Expose()
    @ApiProperty()
    batch_credential_endpoint: string;

    @Expose()
    @ApiProperty()
    credential_configurations_supported: Record<string, Record<string, any>>;
}

export class OauthServerMetadataDTO {
    @Expose()
    @ApiProperty()
    issuer: string;

    @Expose()
    @ApiProperty()
    token_endpoint: string;
}
