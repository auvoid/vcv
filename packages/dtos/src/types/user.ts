import { IsEmail, IsStrongPassword, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateUserDTO {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}

export class LoginUserDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class UpdateUserDTO {
    @IsString()
    oldPassword: string;

    @IsStrongPassword()
    password: string;
}

export class UserDTO {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    createdAt: Date;
}
