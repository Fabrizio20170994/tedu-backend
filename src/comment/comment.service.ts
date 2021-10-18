import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';
import { PostEntity } from '../post/post.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { commentDTO } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
        @InjectRepository(UserCourseEntity) private userCourseRepository: Repository<UserCourseEntity>,
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) {}

    async findPostComments(
        user_id: number, 
        course_id: number, 
        post_id: number
    ): Promise<CommentEntity[]> {
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        const userCourse = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .where('user_course.user_id = :userId', {userId: user_id})
        .andWhere('user_course.course_id = :courseId', {courseId: course_id})
        .getCount();
        if(course.teacher.id == user_id || userCourse > 0){
            const post = await this.postRepository.findOneOrFail(post_id, {
                relations: ['comments']
            })
            return post.comments;
        } else{
            throw new UnauthorizedException('Usuario no autorizado para esta operación');
        }
    }

    async createComment(
        user_id: number,
        course_id: number,
        post_id: number,
        data: Partial<commentDTO>
    ): Promise<CommentEntity> {
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
            const post = await this.postRepository.findOneOrFail(post_id);
            const commentToCreate = await this.commentRepository.create(data);
            commentToCreate.post = post;
            commentToCreate.user = user;
            return await this.commentRepository.save(commentToCreate);
        } else{
            throw new UnauthorizedException('Usuario no autorizado para esta operación');
        }
    }

}
