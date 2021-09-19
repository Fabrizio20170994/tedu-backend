import { Exclude } from "class-transformer";
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator"

export class LoginDTO {
    @IsEmail()
    @IsString()
    @MinLength(4)
    email: string

    @IsString()
    @MinLength(4)
    password: string 
}

export class RegisterDTO extends LoginDTO{
    @IsString()
    @MinLength(2)
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    institution: string;

    @IsOptional()
    @IsPhoneNumber("PE")
    phone: string;
}

