import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseCredOfferDTO {
    @Expose()
    @ApiProperty()
    grants: Record<string, any>;

    @Expose()
    @ApiProperty()
    pin_required: boolean;

    @Expose()
    @ApiProperty()
    credential_issuer: string;

    @Expose()
    @ApiProperty()
    credential_configuration_ids: string[];
}

export class CredOfferDTO {
    @Expose()
    @ApiProperty()
    uri: string;

    @Expose()
    @ApiProperty()
    offer: BaseCredOfferDTO;
}
