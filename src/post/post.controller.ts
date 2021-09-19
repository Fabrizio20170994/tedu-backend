import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { postDTO } from './post.dto';
import { CourseEntity } from '../course/course.entity';

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

    @Get('allPosts')
    async obtenerTodosLosPosts(): Promise<PostEntity[]>{
        return this.postService.findAll();
    }

    @Get()
    async obtenerPostsDelCurso(@Param('course_id') course_id: number): Promise<PostEntity[]>{
        return this.postService.findAllCoursePostsById(course_id);
    }

    @Post()
    async crearPost(@Param('course_id') course_id: number, @Body() data: Partial<postDTO>): Promise<PostEntity>{
        return this.postService.create(course_id, data);
    }

    @Get(':id')
    async obtenerPost(@Param('course_id') course_id: number, @Param('id') post_id: number): Promise<PostEntity>{
        return this.postService.findCoursePostById(course_id, post_id);
    }

    @Put(':id')
    async actualizarPost(
        @Param('course_id') course_id: number, 
        @Param('id') post_id: number, 
        @Body() data: Partial<postDTO>): Promise<any>
    {
        return this.postService.updateCoursePostById(course_id, post_id, data);
    }

    @Delete(':id')
    async eliminarPost(
        @Param('course_id') course_id: number, 
        @Param('id') post_id: number): Promise<{ deleted: boolean; }>{
        return this.postService.deleteCoursePostById(course_id, post_id);
    }

    //Opcional
    @Get('/:id/course')
    async obtenerCursoDelPost(@Param('id') id: number): Promise<CourseEntity>{
        return this.postService.findPostCourseById(id);
    }

}
