import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { postDTO } from './post.dto';
import { CourseEntity } from 'src/course/course.entity';

//@Controller('posts')
@Controller('courses/:course_id/posts')
export class PostController {

    constructor(
        private postService: PostService
    ) {}

    @Get('seed')
    async seed(): Promise<string>{
        this.postService.seed();
        return 'Sedeo Completado';
    }

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

    //Revisar para que traiga el post siempre y cuando pertenezca al curso en el controller
    @Get(':id')
    async obtenerPost(@Param('id') post_id: number): Promise<PostEntity>{
        return this.postService.findById(post_id);
    }

    @Put(':id')
    async actualizarPost(@Param('id') id: number, @Body() data: Partial<postDTO>): Promise<PostEntity>{
        return this.postService.updateById(id, data);
    }

    @Delete(':id')
    async eliminarPost(@Param('id') id: number): Promise<{ deleted: boolean; }>{
        return this.postService.delete(id);
    }

    //Opcional, Revisar
    @Get('/:id/course')
    async obtenerCursoDelPost(@Param('id') id: number): Promise<CourseEntity>{
        return this.postService.findPostCourseById(id);
    }

}
