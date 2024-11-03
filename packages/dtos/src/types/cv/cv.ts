import {
    IsArray,
    IsDateString,
    IsEmail,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';

export class CreateCVDto {
    @IsString()
    name: string;

    @IsString()
    cvName: string;

    @IsString()
    title: string;

    @IsString()
    bio: string;

    @IsObject()
    contacts: { linkedin: string; email: string; phone: string };

    @IsArray()
    credentials: string[];
}
export class CreateExperienceDTO {
    @IsString()
    companyName: string;

    @IsUrl()
    companyUrl: string;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    @IsOptional()
    endDate: Date;

    @IsString()
    jobTitle: string;

    @IsEmail()
    reference: string;
}
