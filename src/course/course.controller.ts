import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { courseDTO } from './course.dto';
import { CourseEntity } from './course.entity';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {

    constructor(private courseService: CourseService) {}

    @Get()
    @UseGuards(AuthGuard())
    async obtenerMisCursos(@User() { id } : UserEntity): 
    Promise<{
        enrolledCourses: CourseEntity[], 
        ownedCourses: CourseEntity[]
    }> {
        return this.courseService.findMyCourses(id);
    }

    @Post()
    @UseGuards(AuthGuard())
    async crearUnCurso(@User() { id } : UserEntity, @Body() data: Partial<courseDTO>): Promise<CourseEntity>{
        return this.courseService.create(id, data);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async obtenerCurso(@User() { id } : UserEntity, @Param('id') curso_id: number): Promise<CourseEntity>{
        return this.courseService.findById(id, curso_id);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async actualizarCurso(
        @User() { id } : UserEntity, 
        @Param('id') course_id: number, 
        @Body() data: Partial<courseDTO>
    ): 
    Promise<{
        message: string, 
        updated: boolean;
    }> {
        return this.courseService.updateById(id, course_id, data);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async eliminarCurso(@User() { id } : UserEntity, @Param('id') course_id: number): 
    Promise<{ 
        message: string,
        deleted: boolean; 
    }> {
        return this.courseService.delete(id, course_id);
    }

    /*@Get('/:id/posts')
    async obtenerPostsdelCurso(@Param('id') id: number): Promise<CourseEntity>{
        return this.courseService.findCoursePostsById(id);
    }*/

}
