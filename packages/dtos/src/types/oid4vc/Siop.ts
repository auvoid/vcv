import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { PresentationDefinitionV2 } from '@sphereon/pex-models';

export class SiopRequestDTO {
    @IsString()
    @IsOptional()
    @ApiProperty()
    id_token?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    vp_token?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    state: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    issuer_state?: string;

    @IsObject()
    @IsOptional()
    @ApiProperty()
    presentation_submission?: PresentationDefinitionV2;
}
