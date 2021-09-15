import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/course/course.entity';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { postDTO } from './post.dto';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>
    ) {}    

    async seed(){
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
    }

    async findAll(): Promise<PostEntity[]>{
        //Considerar restringir a traer solo los posts de un curso
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
        //return postToCreate;
    }

    //Revisar para que traiga el post siempre y cuando pertenezca al curso en el controller
    async findById(id: number): Promise<PostEntity>{
        return await this.postRepository.findOneOrFail(id);
    }
    
    //Revisar bien
    async updateById(id: number, data: Partial<postDTO>): Promise<PostEntity>{
        await this.postRepository.update(id, data);
        return await this.postRepository.findOne(id);
    }

    async delete(id: number): Promise<{ deleted: boolean; }>{
        await this.postRepository.delete(id);
        return { deleted: true };
    }

    async findPostCourseById(id: number): Promise<CourseEntity>{
        const post = await this.postRepository.findOneOrFail(id, {
            relations: ['course']
        });
        return post.course;
    }

}
