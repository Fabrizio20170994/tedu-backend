import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { commentDTO } from './dtos/comment.dto';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { commentQualifiedDTO } from './dtos/commentQualified.dto';

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

    @Put(':id')
    @UseGuards(AuthGuard())
    async actualizarComentario(
        @User() { id } : UserEntity,
        @Param('course_id') course_id: number,
        @Param('post_id') post_id: number,
        @Param('id') comment_id: number,
        @Body() data: Partial<commentDTO>
    ): Promise<{
        message: string;
        updated: boolean;
    }> {
        return this.commentService.updateCommentById(id, course_id, post_id, comment_id, data);
    }

    @Put(':id/qual')
    @UseGuards(AuthGuard())
    async actualizarCalificacionDeComentario(
        @User() { id } : UserEntity,
        @Param('course_id') course_id: number,
        @Param('post_id') post_id: number,
        @Param('id') comment_id: number,
        @Body() data: commentQualifiedDTO
    ): Promise<{
        message: string;
        updated: boolean;
    }> {
        return this.commentService.updateCommentQualificationById(id, course_id, post_id, comment_id, data);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async eliminarComentario(
        @User() { id } : UserEntity,
        @Param('course_id') course_id: number,
        @Param('post_id') post_id: number,
        @Param('id') comment_id: number
    ): Promise<{
        message: string;
        deleted: boolean;
    }> {
        return this.commentService.deleteComment(id, course_id, post_id, comment_id);
    }

}
