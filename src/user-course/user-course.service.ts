import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';
import { createUserCourseDTO } from './create-user-course.dto';
import { UserCourseEntity } from './user-course.entity';

@Injectable()
export class UserCourseService {

    constructor(
        @InjectRepository(UserCourseEntity) private userCourseRepository: Repository<UserCourseEntity>,
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ) {}

    async create(user_id: number, courseCode: string): Promise<UserCourseEntity>{
        const course = await this.courseRepository.findOneOrFail({where: {code: courseCode}})
        const user = await this.userRepo.findOneOrFail(user_id);
        const userCourse = this.userCourseRepository.create();
        userCourse.course = course;
        userCourse.user = user;
        return await this.userCourseRepository.save(userCourse);
    }

    async delete(user_id: number, course_id: number): Promise<{ message: string; }> {
        const deleteRes: DeleteResult = await this.userCourseRepository
        .createQueryBuilder()
        .delete()
        .from('user_course')
        .where('user_course.user_id = :userId', {userId: user_id})
        .andWhere('user_course.course_id = :courseId', {courseId: course_id})
        .execute();
        if(deleteRes.affected > 0){
            return { message: `Usuario "${user_id}" salió del curso ${course_id} satisfactoriamente` };
        }
        return { message: `El usuario "${user_id}" no esta registrado en el curso ${course_id}` };
    }

}
