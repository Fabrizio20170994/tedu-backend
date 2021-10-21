import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { createUserCourseDTO } from './dtos/create-user-course.dto';
import { deleteUserCourseDTO } from './dtos/delete-user-course.dto';
import { updateUserCourseDTO } from './dtos/update-user-course.dto';
import { UserCourseService } from './user-course.service';

@Controller('enrollment')
export class UserCourseController {

    constructor(private userCourseService: UserCourseService) {}

    @Post()
    @UseGuards(AuthGuard())
    async unirseACurso(@User() { id } : UserEntity, @Body() data: createUserCourseDTO): 
    Promise<{
        message: string, 
        created: boolean, 
        vacanciesLeft: number;
    }> {
        return this.userCourseService.create(id, data.code);
    }

    /*@Put()
    @UseGuards(AuthGuard())
    async actualizarPuntajeDeEstudiante(@User() { id } : UserEntity, @Body() data: updateUserCourseDTO):
    Promise<{
        message: string, 
        updated: boolean,
        currentStudentScore: number;
    }> {
        return this.userCourseService.update(id, data.course_id, data.student_id)
    }*/

    @Delete('leave')
    @UseGuards(AuthGuard())
    async salirDeCurso(@User() { id } : UserEntity, @Body() data: deleteUserCourseDTO): 
    Promise<{ 
        message: string, 
        deleted: boolean;
    }> {
        return this.userCourseService.leaveCourse(id, data.course_id);
    }

    @Delete()
    @UseGuards(AuthGuard())
    async eliminarAlumnoDeCurso(
        @User() { id } : UserEntity,
        @Body() data: updateUserCourseDTO
    ){
        return this.userCourseService.removeStudent(id, data.student_id, data.course_id);
    }

}
