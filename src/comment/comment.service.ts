import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';
import { PostEntity } from '../post/post.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { commentDTO } from './dtos/comment.dto';
import { CommentEntity } from './comment.entity';
import { commentQualifiedDTO } from './dtos/commentQualified.dto';

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
            const commentToCreate = this.commentRepository.create(data);
            commentToCreate.post = post;
            commentToCreate.user = user;
            return await this.commentRepository.save(commentToCreate);
        } else{
            throw new UnauthorizedException('Usuario no autorizado para esta operación');
        }
    }

    async updateCommentById(
        user_id: number,
        course_id: number,
        post_id: number,
        comment_id: number,
        data: Partial<commentDTO>
    ): Promise<{
        message: string;
        updated: boolean;
    }> {
        const comment = await this.commentRepository.findOneOrFail(comment_id, {
            relations: ['user']
        });
        const userCourse = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .where('user_course.user_id = :userId', {userId: user_id})
        .andWhere('user_course.course_id = :courseId', {courseId: course_id})
        .getCount();
        if(comment.user.id == user_id){
            await this.postRepository.findOneOrFail(post_id)
            /*const updateRes: UpdateResult = await this.commentRepository
            .createQueryBuilder()
            .update('comment')
            .set(data)
            .where('comment.id = :commentId', {commentId: comment_id})
            .andWhere('comment.post_id = :postId', {postId: post_id})
            .execute();*/
            const updateRes: UpdateResult = await this.commentRepository.update(comment_id, data)
            if(updateRes.affected > 0){
                return {
                    message: `El comentario ${comment_id} ha sido actualizado correctamente`, 
                    updated: true
                };
            }
            return { 
                message: `El comentario ${comment_id} no pudo ser actualizado`, 
                updated: false
            };
        } else{
            throw new UnauthorizedException('Usuario no autorizado para esta operación');
        }
    }

    async updateCommentQualificationById(
        user_id: number,
        course_id: number,
        post_id: number,
        comment_id: number,
        data: commentQualifiedDTO
    ): Promise<{
        message: string;
        updated: boolean;
    }> {
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        if(course.teacher.id == user_id){
            await this.postRepository.findOneOrFail(post_id);
            const comment = await this.commentRepository.findOneOrFail(comment_id, {
                relations: ['user']
            });
            if(comment.user.id == course.teacher.id){
                return {
                    message: `El profesor del curso no puede calificar sus propios comentarios`, 
                    updated: false
                };
            }
            /*const updateRes: UpdateResult = await this.commentRepository
            .createQueryBuilder()
            .update('comment')
            .set(data)
            .where('comment.id = :commentId', {commentId: comment_id})
            .andWhere('comment.post_id = :postId', {postId: post_id})
            .execute();*/
            const updateRes: UpdateResult = await this.commentRepository.update(comment_id, data);
            if(updateRes.affected > 0){
                const sc = await this.countPostAndCommentsPoints(comment.user.id, course_id);
                await this.userCourseRepository
                .createQueryBuilder()
                .update('user_course')
                .set({ score: sc })
                .where('user_course.user_id = :userId', {userId: comment.user.id})
                .andWhere('user_course.course_id = :courseId', {courseId: course_id})
                .execute();
                return {
                    message: `La calificación del comentario ${comment_id} ha sido actualizada correctamente`, 
                    updated: true
                };
            }
            return { 
                message: `La calificación del comentario ${comment_id} no pudo ser actualizada`, 
                updated: false
            };
        } else{
            throw new UnauthorizedException('Usuario no autorizado para esta operación');
        }
    }

    async deleteComment(
        user_id: number,
        course_id: number,
        post_id: number,
        comment_id: number
    ): Promise<{
        message: string;
        deleted: boolean;
    }> {
        const comment = await this.commentRepository.findOneOrFail(comment_id, {
            relations: ['user']
        });
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        if(comment.user.id == user_id || course.teacher.id == user_id){
            //await this.postRepository.findOneOrFail(post_id);
            const deleteRes: DeleteResult = await this.commentRepository
            .createQueryBuilder()
            .delete()
            .from('comment')
            .where('comment.id = :commentId', {commentId: comment_id})
            .andWhere('comment.post_id = :postId', {postId: post_id})
            .execute();
            //const deleteRes: DeleteResult = await this.commentRepository.delete(comment_id);
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

    
    /******************FUNCTIONS*********************/

    async countPostAndCommentsPoints(user_id: number, course_id: number): Promise<number>{
        const posts: number = await this.postRepository
        .createQueryBuilder('post')
        .where('post.user_id = :userId', {userId: user_id})
        .andWhere('post.course_id = :courseId', {courseId: course_id})
        .andWhere('post.qualified = :value', {value: true})
        .getCount();
        const comments: number = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.post', 'post')
        .where('comment.user_id = :userId', { userId: user_id })
        .andWhere('comment.qualified = :value', { value: true })
        .andWhere('post.course_id = :courseId', { courseId: course_id })
        .getCount();
        /*const commentsFiltered: CommentEntity[] = [];
        posts[0].forEach(post => {
            comments.forEach(comment => {
                if(post.id == comment.post.id){
                    commentsFiltered.push(comment);
                }
            });
        });*/
        /*for(let post of posts[0]){
            for(let comment of commentsRaw){
                if(post.id == comment.post.id){
                    commentsFiltered.push(comment);
                }
            }
        }*/
        return posts+comments;
    }

}
