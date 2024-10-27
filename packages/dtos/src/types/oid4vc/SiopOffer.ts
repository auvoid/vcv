import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SiopOfferDTO {
    @Expose()
    @ApiProperty({ description: 'SIOPv2 compliant uri' })
    uri?: string;

    @Expose()
    @ApiProperty({ description: 'id for the request', required: false })
    id: string;

    @Expose()
    @ApiProperty({ description: 'JWT encoded request object' })
    request: string;
}
