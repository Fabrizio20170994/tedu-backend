import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(120)
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  institution: string;

  @IsOptional()
  @IsPhoneNumber('PE')
  @MaxLength(15)
  phone: string;
}

export class UpdateUserDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  institution: string;

  @IsOptional()
  @IsPhoneNumber('PE')
  @MaxLength(15)
  phone: string;
}

export interface AuthPayload {
  email: string;
}
