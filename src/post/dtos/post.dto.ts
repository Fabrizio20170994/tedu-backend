import { FileDTO } from '../../file/file.dto';

export interface postDTO {
  text: string;
  files: FileDTO[];
}
