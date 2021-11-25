import { IsDateString, IsOptional, IsString, MinLength } from "class-validator";
import { UserEntity } from "../../auth/entities/user.entity";
import { CourseEntity } from "../../course/course.entity";

export class EventDTO {

    @IsString()
    @MinLength(2, { message: 'El título debe tener 2 o más caracteres' })
    title: string;

    @IsDateString({ strict: true })
    start: Date;

    @IsDateString({ strict: true })
    end: Date;

    @IsOptional()
    course: CourseEntity;

    @IsOptional()
    user: UserEntity;

}