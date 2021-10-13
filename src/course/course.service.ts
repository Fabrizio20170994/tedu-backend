import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { courseDTO } from './course.dto';
import { CourseEntity } from './course.entity';

@Injectable()
export class CourseService {

    constructor(
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
        @InjectRepository(UserCourseEntity) private userCourseRepository: Repository<UserCourseEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) {}

    async findAll(): Promise<CourseEntity[]>{
        return await this.courseRepository.find();
    }

    async findMyCourses(user_id:number): 
    Promise<{
        enrolledCourses: CourseEntity[],
        ownedCourses: CourseEntity[]
    }> {
        const userObtained = await this.userRepository.findOneOrFail(user_id, {
            relations: ['courses']
        });
        const temp = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .leftJoinAndSelect('user_course.course', 'course')
        .where('user_course.user_id = :userId', {userId: user_id})
        .getMany();
        const array: CourseEntity[] = [];
        temp.forEach( element => {
            array.push(element.course);
        })
        return {
            enrolledCourses: array,
            ownedCourses: userObtained.courses
        };
    }

    async create(user_id: number, data: Partial<courseDTO>): Promise<CourseEntity>{
        if(data.vacancies != null && data.vacancies < 0){
            data.vacancies = 0;
        }
        const curso = this.courseRepository.create(data);
        const teacher = await this.userRepository.findOneOrFail(user_id);
        curso.teacher = teacher;
        return await this.courseRepository.save(curso);
    }

    async findById(user_id: number, course_id: number): Promise<CourseEntity>{
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        //const user = await this.userRepository.findOneOrFail(user_id);
        const userCourse = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .where('user_course.user_id = :userId', {userId: user_id})
        .andWhere('user_course.course_id = :courseId', {courseId: course_id})
        .getCount();
        if(course.teacher.id == user_id || userCourse > 0){
            return course;
        } else{
            throw new UnauthorizedException('No autorizado para esta operación');
        }
    }
    
    //Considerar cambiar el update a un queryBuilder para ahi validar de frente si es profe del curso
    //Como en el update del post service
    async updateById(user_id: number, course_id: number, data: Partial<courseDTO>):
    Promise<{
        message: string, 
        updated: boolean;
    }> {
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        //const user = await this.userRepository.findOneOrFail(user_id);   //if(course.teacher.id == user.id){
        if(course.teacher.id == user_id){
            if(data.vacancies != null){
                if(data.vacancies < 0){
                    return {
                        message: `Nuevo número de vacantes no puede ser negativo`, 
                        updated: false
                    };
                }
                const count = await this.userCourseRepository
                .createQueryBuilder('user_course')
                .where('user_course.course_id = :courseId', {courseId: course.id})
                .getCount();
                if(count > data.vacancies){
                    return {
                        message: `Nuevo número de vacantes no puede ser menor al número de estudiantes actualmente matriculados`, 
                        updated: false
                    };
                }
            }
            const updateRes = await this.courseRepository.update(course_id, data);
            if(updateRes.affected > 0){
                return {
                    message: `El curso ${course.id} ha sido actualizado correctamente`, 
                    updated: true
                };
            } else{
                return {
                    message: `El curso ${course.id} no ha sido actualizado`, 
                    updated: false
                };
            }
        } else{
            return {
                message: `El usuario ${user_id} no es profesor del curso ${course.id}`, 
                updated: false
            };
        }
    }

    async delete(user_id: number, course_id: number): 
    Promise<{ 
        message: string, 
        deleted: boolean; 
    }> {
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        if(course.teacher.id == user_id){
            const deleteRes = await this.courseRepository.delete(course_id);
            if(deleteRes.affected > 0){
                return { 
                    message: `El curso ${course_id} fue eliminado satisfactoriamente`,
                    deleted: true 
                };
            } else{
                return {
                    message: `El curso ${course.id} no pudo ser eliminado`, 
                    deleted: false
                };
            }
            
        } else{
            throw new UnauthorizedException('No autorizado para esta operación');
        }
    }

    async getMembers(
        user_id: number, 
        course_id: number
    ): Promise<{
        teacher: UserEntity,
        students: UserEntity[]
    }> {
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        const userCourse = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .where('user_course.user_id = :userId', {userId: user_id})
        .andWhere('user_course.course_id = :courseId', {courseId: course_id})
        .getCount();
        if(course.teacher.id == user_id || userCourse > 0){
            const temp = await this.userCourseRepository
            .createQueryBuilder('user_course')
            .leftJoinAndSelect('user_course.user', 'user')
            .where('user_course.course_id = :courseId' , {courseId: course_id})
            .getMany();
            const students: UserEntity[] = [];
            temp.forEach( element => {
                students.push(element.user);
            })
            return {
                teacher: course.teacher,
                students: students
            };
        } else{
            throw new UnauthorizedException('No autorizado para esta operación');
        }
    }

    /*
    async findCoursePostsById(id: number): Promise<CourseEntity> {
        return await this.courseRepository.findOneOrFail(id, {
            relations: ['posts']
        });
    }*/

}
