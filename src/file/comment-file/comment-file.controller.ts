import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../../auth/entities/user.entity';
import { User } from '../../auth/user.decorator';
import { FileDTO } from '../file.dto';
import { CommentFileService } from './comment-file.service';

@Controller('courses/:course_id/posts/:post_id/comments/:commentId/files')
export class CommentFileController {
  constructor(private fileService: CommentFileService) {}

  @Post()
  @UseGuards(AuthGuard())
  async saveCommentFiles(
    @User() { id }: UserEntity,
    @Param('course_Id') courseId: number,
    @Param('post_Id') postId: number,
    @Param('commentId') commentId: number,
    @Body() data: Partial<FileDTO>,
  ) {
    return this.fileService.commentFile(id, data, commentId);
  }
}
