import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { courseDTO } from './course.dto';
import { CourseEntity } from './course.entity';
import { CourseService } from './course.service';

@Controller('cursos')
export class CourseController {

    constructor(private courseService: CourseService) {}

    @Get()
    async obtenerCursos(): Promise<CourseEntity[]>{
        return this.courseService.findAll();
    }

    @Post()
    async crearCurso(@Body() data: Partial<courseDTO>): Promise<CourseEntity>{
        return this.courseService.create(data);
    }

    @Get(':id')
    async obtenerCurso(@Param('id') curso_id: number): Promise<CourseEntity>{
        return this.courseService.findById(curso_id);
    }

    @Put(':id')
    async actualizarCurso(@Param('id') id: number, @Body() data: Partial<courseDTO>): Promise<CourseEntity>{
        return this.courseService.updateById(id, data);
    }

    @Delete(':id')
    async eliminarCurso(@Param('id') id: number): Promise<{ deleted: boolean; }>{
        return this.courseService.delete(id);
    }

    @Get('/:id/posts')
    async obtenerPostsdelCurso(@Param('id') id: number): Promise<CourseEntity>{
        return this.courseService.findCoursePostsById(id);
    }

}
