import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/post.entity';
import { Repository } from 'typeorm';
import { courseDTO } from './course.dto';
import { CourseEntity } from './course.entity';

@Injectable()
export class CourseService {

    constructor(
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>
    ) {}

    async findAll(): Promise<CourseEntity[]>{
        return await this.courseRepository.find();
    }

    async create(data: Partial<courseDTO>): Promise<CourseEntity>{
        const curso = this.courseRepository.create(data);
        await this.courseRepository.save(curso);
        return curso;
    }

    async findById(id: number): Promise<CourseEntity>{
        //return await this.cursoRepository.findOne({where: {curso_id: curso_id} });
        return await this.courseRepository.findOneOrFail(id);
    }
    
    async updateById(id: number, data: Partial<courseDTO>): Promise<CourseEntity>{
        await this.courseRepository.update({id}, data);
        return await this.courseRepository.findOne(id);
    }

    async delete(id: number): Promise<{ deleted: boolean; }>{
        await this.courseRepository.delete(id);
        return { deleted: true };
    }

    async findCoursePostsById(id: number): Promise<CourseEntity>{
        return await this.courseRepository.findOneOrFail(id, {
            relations: ['posts']
        });
    }

}
