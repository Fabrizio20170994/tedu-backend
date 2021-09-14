import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { createPostDTO } from './create-post.dto';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { updatePostDTO } from './update-post.dto';

@Controller('posts')
export class PostController {

    constructor(
        private postService: PostService
    ) {}

    @Get('seed')
    async seed(): Promise<string>{
        this.postService.seed();
        return 'Sedeo Completado';
    }

    @Get()
    async obtenerPosts(): Promise<PostEntity[]>{
        return this.postService.findAll();
    }

    @Post()
    async crearPost(@Body() data: Partial<createPostDTO>): Promise<PostEntity>{
        return this.postService.create(data);
    }

    @Get(':id')
    async obtenerPost(@Param('id') curso_id: number): Promise<PostEntity>{
        return this.postService.findById(curso_id);
    }

    @Put(':id')
    async actualizarPost(@Param('id') id: number, @Body() data: Partial<updatePostDTO>): Promise<PostEntity>{
        return this.postService.updateById(id, data);
    }

    @Delete(':id')
    async eliminarPost(@Param('id') id: number): Promise<{ deleted: boolean; }>{
        return this.postService.delete(id);
    }

    @Get('/:id/curso')
    async obtenerCursoDelPost(@Param('id') id: number): Promise<PostEntity>{
        return this.postService.findPostCourseById(id);
    }

}
