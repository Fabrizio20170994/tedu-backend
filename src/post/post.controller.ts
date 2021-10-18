import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { postDTO } from './post.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.decorator';
import { UserEntity } from '../auth/entities/user.entity';

//@Controller('posts')
@Controller('courses/:course_id/posts')
export class PostController {

    constructor(
        private postService: PostService
    ) {}

    /*@Get('seed')
    async seed(): Promise<string>{
        this.postService.seed();
        return 'Sedeo Completado';
    }*/

    /*
    @Get('allPosts')
    async obtenerTodosLosPosts(): Promise<PostEntity[]>{
        return this.postService.findAll();
    }*/

    @Get()
    @UseGuards(AuthGuard())
    async obtenerPostsDelCurso(
        @User() { id } : UserEntity, 
        @Param('course_id') course_id: number
    ): Promise<PostEntity[]> {
        return this.postService.findAllCoursePostsById(id, course_id);
    }

    @Post()
    @UseGuards(AuthGuard())
    async crearPost(
        @User() { id } : UserEntity, 
        @Param('course_id') course_id: number,
        @Body() data: Partial<postDTO>
    ): Promise<PostEntity> {
        return this.postService.create(id, course_id, data);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async obtenerPost(
        @User() { id } : UserEntity,
        @Param('course_id') course_id: number, 
        @Param('id') post_id: number
    ): Promise<PostEntity> {
        return this.postService.findCoursePostById(id, course_id, post_id);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async actualizarPost(
        @User() { id } : UserEntity,
        @Param('course_id') course_id: number, 
        @Param('id') post_id: number, 
        @Body() data: Partial<postDTO>
    ): Promise<{
        message: string, 
        updated: boolean;
    }> {
        return this.postService.updateCoursePostById(id, course_id, post_id, data);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async eliminarPost(
        @User() { id } : UserEntity,
        @Param('course_id') course_id: number, 
        @Param('id') post_id: number
    ): Promise<{ deleted: boolean; }> {
        return this.postService.deleteCoursePostById(id, course_id, post_id);
    }

    //Opcional
    /*
    @Get('/:id/course')
    async obtenerCursoDelPost(@Param('id') id: number): Promise<CourseEntity>{
        return this.postService.findPostCourseById(id);
    }*/

}
