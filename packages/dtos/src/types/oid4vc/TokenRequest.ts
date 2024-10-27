import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TokenRequestDTO {
    @ApiProperty()
    @IsString()
    'pre-authorized_code': string;

    @ApiProperty()
    @IsString()
    grant_type: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    user_pin: number;
}
