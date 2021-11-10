import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsString()
  @MinLength(4)
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  institution: string;

  @IsOptional()
  @IsPhoneNumber('PE')
  phone: string;
}

export class UpdateUserDTO {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  institution: string;

  @IsOptional()
  @IsPhoneNumber('PE')
  phone: string;
}

export interface AuthPayload {
  email: string;
}
