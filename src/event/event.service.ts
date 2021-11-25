import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';
import { EventEntity } from './event.entity';

@Injectable()
export class EventService {

    constructor(
        @InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>
    ) {}

    async findAllUserEvents(user_id: number): Promise<EventEntity[]> {
        const userObtained = await this.userRepository.findOneOrFail(user_id, {
            relations: ['events']
        })
        return userObtained.events;
    }

}
