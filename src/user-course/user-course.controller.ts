import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { createUserCourseDTO } from './create-user-course.dto';
import { deleteUserCourseDTO } from './delete-user-course.dto';
import { UserCourseEntity } from './user-course.entity';
import { UserCourseService } from './user-course.service';

@Controller('enrollment')
export class UserCourseController {

    constructor(private userCourseService: UserCourseService) {}

    @Post()
    @UseGuards(AuthGuard())
    async unirseACurso(@User() { id } : UserEntity, @Body() data: createUserCourseDTO): Promise<UserCourseEntity>{
        return this.userCourseService.create(id, data.code);
    }

    @Delete()
    @UseGuards(AuthGuard())
    async salirDeCurso(@User() { id } : UserEntity, @Body() data: deleteUserCourseDTO): Promise<{ message: string; }>{
        return this.userCourseService.delete(id, data.id);
    }

}
