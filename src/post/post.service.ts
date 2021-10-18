import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from '../course/course.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PostEntity } from './post.entity';
import { postDTO } from './post.dto';
import { UserEntity } from '../auth/entities/user.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(UserCourseEntity) private userCourseRepository: Repository<UserCourseEntity>
    ) {}    

    /*async seed(){
        const curso1 = this.courseRepository.create({
            vacancies: 40,
            desc: 'Este es el curso de prueba',
            start_date: '2021-10-01T06:30:00',
            end_date: '2021-11-15T15:45:56',
        })
        await this.courseRepository.save(curso1);

        const post1 = this.postRepository.create({
            text: 'Esta es una publicación :)'
        });
        post1.course = curso1;
        await this.postRepository.save(post1);
        const post2 = this.postRepository.create({
            text: 'Esta también es una publicación :)'
        });
        post2.course = curso1;
        await this.postRepository.save(post2);
        const post3 = this.postRepository.create({
            text: 'Esta también es una publicación :)'
        });
        post3.course = curso1;
        await this.postRepository.save(post3);
    }*/

    async findAll(): Promise<PostEntity[]>{
        return await this.postRepository.find();
    }
    
    async findAllCoursePostsById(user_id: number, course_id: number): Promise<PostEntity[]> {
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        const userCourse = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .where('user_course.user_id = :userId', {userId: user_id})
        .andWhere('user_course.course_id = :courseId', {courseId: course_id})
        .getCount();
        if(course.teacher.id == user_id || userCourse > 0){
            //Borré esto: .leftJoinAndSelect('post.comments', 'comments')
            return await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .where('post.course_id = :courseId', {courseId: course_id})
            .getMany();
        } else{
            throw new UnauthorizedException('Usuario no autorizado para esta operación');
        }
    }

    async create(user_id: number, course_id: number, data: Partial<postDTO>): Promise<PostEntity>{
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        const userCourse = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .where('user_course.user_id = :userId', {userId: user_id})
        .andWhere('user_course.course_id = :courseId', {courseId: course_id})
        .getCount();
        if(course.teacher.id == user_id || userCourse > 0){
            const user = await this.userRepository.findOneOrFail(user_id);
            const postToCreate = this.postRepository.create(data);
            postToCreate.course = course;
            postToCreate.user = user;
            return await this.postRepository.save(postToCreate);
        } else{
            throw new UnauthorizedException('Usuario no autorizado para esta operación');
        }
    }

    async findCoursePostById(user_id: number, course_id: number, post_id: number): Promise<PostEntity>{
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        const userCourse = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .where('user_course.user_id = :userId', {userId: user_id})
        .andWhere('user_course.course_id = :courseId', {courseId: course_id})
        .getCount();
        if(course.teacher.id == user_id || userCourse > 0){
            return await this.postRepository
            .createQueryBuilder('post')
            .where('post.id = :postId', {postId: post_id})
            .andWhere('post.course_id = :courseId', {courseId: course_id})
            .getOneOrFail();
        } else {
            throw new UnauthorizedException('Usuario no autorizado para esta operación');
        }
    }

    async updateCoursePostById(
        user_id: number,
        course_id: number, 
        post_id: number, 
        data: Partial<postDTO>
    ): Promise<{
            message: string, 
            updated: boolean;
    }> {
        //await this.postRepository.update(id, data);
        const updateRes: UpdateResult = await this.postRepository
        .createQueryBuilder()
        .update('post')
        .set(data)
        .where('post.id = :postId', {postId: post_id})
        .andWhere('post.course_id = :courseId', {courseId: course_id})
        .andWhere('post.user_id = :userId', {userId: user_id})
        .execute();
        if(updateRes.affected > 0){
            return {
                message: `El post ${post_id} del curso ${course_id} ha sido actualizado correctamente`, 
                updated: true
            };
        } else{
            return { 
                message: `El post ${post_id} del curso ${course_id} no pudo ser actualizado`, 
                updated: false
            };
        }
    }

    async deleteCoursePostById(
        user_id: number, 
        course_id: number, 
        post_id: number
    ): Promise<{ 
        message: string,
        deleted: boolean; 
    }> {
        //await this.postRepository.delete(id);
        const deleteRes: DeleteResult = await this.postRepository
        .createQueryBuilder()
        .delete()
        .from('post')
        .where('post.id = :postId', {postId: post_id})
        .andWhere('post.course_id = :courseId', {courseId: course_id})
        .andWhere('post.user_id = :userId', {userId: user_id})
        .execute();
        if(deleteRes.affected > 0){
            return { 
                message: `El post ${post_id} del curso ${course_id} ha sido eliminado correctamente`, 
                deleted: true 
            };
        }
        return { 
            message: `El post ${post_id} del curso ${course_id} no pudo ser eliminado`,
            deleted: false 
        };
    }

    /*
    async findPostCourseById(id: number): Promise<CourseEntity>{
        const post = await this.postRepository.findOneOrFail(id, {
            relations: ['course']
        });
        return post.course;
    }
    */

}
