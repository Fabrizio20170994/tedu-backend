import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { commentDTO } from './comment.dto';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';

@Controller('courses/:course_id/posts/:post_id/comments')
export class CommentController {

    constructor(
        private commentService: CommentService
    ) {}

    @Get()
    @UseGuards(AuthGuard())
    async obtenerComentariosDePublicacion(
        @User() { id } : UserEntity, 
        @Param('course_id') course_id: number,
        @Param('post_id') post_id: number
    ): Promise<CommentEntity[]> {
        return this.commentService.findPostComments(id, course_id, post_id);
    }

    @Post()
    @UseGuards(AuthGuard())
    async crearComentario(
        @User() { id } : UserEntity, 
        @Param('course_id') course_id: number,
        @Param('post_id') post_id: number,
        @Body() data: Partial<commentDTO>
    ): Promise<CommentEntity> {
        return this.commentService.createComment(id, course_id, post_id, data);
    }

}
