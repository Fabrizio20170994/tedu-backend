import { FileDTO } from '../../file/file.dto';

export interface messageDTO {
  text: string;
  files: FileDTO[];
}
