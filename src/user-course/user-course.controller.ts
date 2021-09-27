import { Body, Controller, Delete, Post } from '@nestjs/common';
import { createUserCourseDTO } from './create-user-course.dto';
import { deleteUserCourseDTO } from './delete-user-course.dto';
import { UserCourseEntity } from './user-course.entity';
import { UserCourseService } from './user-course.service';

@Controller('enrollment')
export class UserCourseController {

    constructor(private userCourseService: UserCourseService) {}

    @Post()
    async unirseACurso(@Body() data: createUserCourseDTO): Promise<UserCourseEntity>{
        return this.userCourseService.create("", data.code);
    }

    @Delete()
    async salirDeCurso(@Body() data: deleteUserCourseDTO): Promise<{ message: string; }>{
        return this.userCourseService.delete("", data.id);
    }

}
