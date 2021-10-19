import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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

    async updateComment(
        user_id: number,
        comment_id: number,
        data: Partial<commentDTO>
    ): Promise<{
        message: string,
        updated: boolean;
    }> {
        const comment = await this.commentRepository.findOneOrFail(comment_id, {
            relations: ['user']
        });
        if(comment.user.id == user_id){
            const updateRes: UpdateResult = await this.commentRepository
            .createQueryBuilder()
            .update('comment')
            .set(data)
            .where('comment.id = :commentId', {commentId: comment_id})
            .execute();
            if(updateRes.affected > 0){
                return {
                    message: `El comentario ${comment_id} ha sido actualizado correctamente`, 
                    updated: true
                };
            } else{
                return { 
                    message: `El comentario ${comment_id} no pudo ser actualizado`, 
                    updated: false
                };
            }
        } else{
            throw new UnauthorizedException('Usuario no autorizado para esta operación');
        }
    }

    async deleteComment(
        user_id: number,
        course_id: number,
        comment_id: number
    ): Promise<{
        message: string,
        deleted: boolean;
    }> {
        const comment = await this.commentRepository.findOneOrFail(comment_id, {
            relations: ['user']
        });
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        if(comment.user.id == user_id || course.teacher.id == user_id){
            const deleteRes: DeleteResult = await this.commentRepository
            .createQueryBuilder()
            .delete()
            .from('comment')
            .where('comment.id = :commentId', {commentId: comment_id})
            .execute();
            if(deleteRes.affected > 0){
                return { 
                    message: `El comentario ${comment_id} ha sido eliminado correctamente`, 
                    deleted: true 
                };
            }
            return {
                message: `El comentario ${comment_id} no pudo ser eliminado`, 
                deleted: false
            };
        } else{
            throw new UnauthorizedException('Usuario no autorizado para esta operación');
        }
    }

}
