import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenResponseDTO {
    @Expose()
    @ApiProperty()
    access_token: string;

    @Expose()
    @ApiProperty()
    token_type: string;

    @Expose()
    @ApiProperty()
    expires_in: number;

    @Expose()
    @ApiProperty()
    c_nonce: string;

    @Expose()
    @ApiProperty()
    c_nonce_expires_in: number;
}
