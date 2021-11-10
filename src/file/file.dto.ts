import { IsUrl } from 'class-validator';

export class FileDTO {
  @IsUrl()
  key: string;
}
