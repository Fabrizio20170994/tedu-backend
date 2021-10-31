import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../../../auth/entities/user.entity';
import { User } from '../../../auth/user.decorator';
import { FileDTO } from '../../file.dto';
import { PostFileService } from './post-file.service';

@Controller('courses/:course_id/posts/:post_id/files')
export class PostFileController {
    constructor (
        private fileService: PostFileService,
    ) {}

    @Post()
    @UseGuards(AuthGuard())
    async saveCommentFiles(
        @User() { id } : UserEntity,
        @Param('postId') postId : number,
        @Body() data: Partial<FileDTO>,
        ) {
        return this.fileService.postFile(id, data, postId) }
}
