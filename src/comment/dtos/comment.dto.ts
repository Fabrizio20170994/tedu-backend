import { FileDTO } from '../../file/file.dto';

export interface commentDTO {
  text: string;
  files: FileDTO[];
}
