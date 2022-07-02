import { IsString, IsUrl, MaxLength } from 'class-validator';

export class FileDTO {
  @IsString()
  @IsUrl()
  key: string;

  @IsString()
  @MaxLength(255)
  name: string;
}
