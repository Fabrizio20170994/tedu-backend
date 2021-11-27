import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../../auth/entities/user.entity';
import { User } from '../../auth/user.decorator';
import { FileDTO } from '../file.dto';
import { MessageFileService } from './message-file.service';

@Controller('messages/:messageId/files')
export class MessageFileController {
  constructor(private fileService: MessageFileService) {}

  @Post()
  @UseGuards(AuthGuard())
  async saveMessageFiles(
    @User() { id }: UserEntity,
    @Param('messageId') postId: number,
    @Body() data: Partial<FileDTO>,
  ) {
    return this.fileService.messageFile(id, data, postId);
  }
  @Delete(':fileId')
  @UseGuards(AuthGuard())
  async deleteMessageFile(
    @User() { id }: UserEntity,
    @Param('messageId') messageId: number,
    @Param('fileId') fileId: number,
  ) {
    return this.fileService.delete(id, messageId, fileId);
  }
}
