import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';
import { EventDTO } from './dtos/event.dto';
import { EventEntity } from './event.entity';

@Injectable()
export class EventService {

    constructor(
        @InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>
    ) {}

    async createEvent(
        user_id: number, 
        data: EventDTO
    ): Promise<EventEntity> {
        const userObtained = await this.userRepository.findOneOrFail(user_id);
        const newEvent = this.eventRepository.create({
            user: userObtained,
            title: data.title,
            start: data.start,
            end: data.end
        });
        return await this.eventRepository.save(newEvent);
    }

    async findAllUserEvents(
        user_id: number
    ): Promise<EventEntity[]> {
        const userObtained = await this.userRepository.findOneOrFail(user_id, {
            relations: ['events']
        })
        return userObtained.events;
    }

    async findUserEventById(
        user_id: number,
        event_id: number
    ): Promise<EventEntity> {
        const event = await this.eventRepository.findOneOrFail(event_id, {
            relations: ['user']
        });
        if (user_id != event.user.id){
            throw new UnauthorizedException('No autorizado para esta operación');
        }
        return event;
    }

    async deleteEvent(
        user_id: number, 
        event_id: number
    ): Promise<{
        message: string, 
        deleted: boolean
    }> {
        const event = await this.eventRepository.findOneOrFail(event_id, {
            relations: ['user']
        });
        if (user_id != event.user.id){
            throw new UnauthorizedException('No autorizado para esta operación');
        }
        const deleteRes: DeleteResult = await this.eventRepository.delete(event_id);
        if(deleteRes.affected > 0){
            return {
                message: `el evento (id: ${event_id}) fue eliminado satisfactoriamente`,
                deleted: true
            }
        }
        return {
            message: `No se pudo eliminar el evento (id: ${event_id})`,
            deleted: false
        }
    }

}
