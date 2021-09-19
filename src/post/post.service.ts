import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from '../course/course.entity';
import { DeleteResult, QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { PostEntity } from './post.entity';
import { postDTO } from './post.dto';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>
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
    
    async findAllCoursePostsById(course_id: number): Promise<PostEntity[]>{
        const curso = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['posts']
        });
        return curso.posts;
    }

    async create(course_id: number, data: Partial<postDTO>): Promise<PostEntity>{
        const postToCreate = this.postRepository.create(data);
        const curso = await this.courseRepository.findOneOrFail(course_id);
        postToCreate.course = curso;
        return await this.postRepository.save(postToCreate);
    }

    /*
    async findById(id: number): Promise<PostEntity>{
        return await this.postRepository.findOneOrFail(id);
    }*/

    async findCoursePostById(course_id: number, post_id: number){
        return await this.postRepository
        .createQueryBuilder('post')
        .where('post.id = :postId', {postId: post_id})
        .andWhere('post.course_id = :courseId', {courseId: course_id})
        .getOneOrFail();
    }
    
    /*
    async updateById(id: number, data: Partial<postDTO>): Promise<PostEntity>{
        await this.postRepository.update(id, data);
        return await this.postRepository.findOne(id);
    }*/

    async updateCoursePostById(
        course_id: number, 
        post_id: number, 
        data: Partial<postDTO>): Promise<any>
    {
        const updateRes: UpdateResult = await this.postRepository
        .createQueryBuilder()
        .update('post')
        .set(data)
        .where('post.id = :postId', {postId: post_id})
        .andWhere('post.course_id = :courseId', {courseId: course_id})
        .execute();
        if(updateRes.affected > 0){
            return await this.postRepository.findOneOrFail(post_id);
        }
        return { affected: updateRes.affected };
    }

    async deleteCoursePostById(course_id: number, post_id: number): Promise<{ deleted: boolean; }>{
        //await this.postRepository.delete(id);
        const deleteRes: DeleteResult = await this.postRepository
        .createQueryBuilder()
        .delete()
        .from('post')
        .where('post.id = :postId', {postId: post_id})
        .andWhere('post.course_id = :courseId', {courseId: course_id})
        .execute();
        if(deleteRes.affected > 0){
            return { deleted: true };
        }
        return { deleted: false };
    }

    async findPostCourseById(id: number): Promise<CourseEntity>{
        const post = await this.postRepository.findOneOrFail(id, {
            relations: ['course']
        });
        return post.course;
    }

}
