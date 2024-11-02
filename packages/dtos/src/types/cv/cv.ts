import { IsArray, IsObject, IsString } from 'class-validator';

export class CreateCVDto {
    @IsString()
    name: string;

    @IsString()
    cvName: string;

    @IsString()
    title: string;

    @IsString()
    bio: string;

    @IsArray()
    skills: string[];

    @IsObject()
    contacts: { linkedin: string; email: string; phone: string };

    @IsString()
    type: 'education' | 'experience';

    @IsArray()
    credentials: string[];
}
