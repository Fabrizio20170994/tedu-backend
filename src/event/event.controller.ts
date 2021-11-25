import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { EventEntity } from './event.entity';
import { EventService } from './event.service';

@Controller('event')
export class EventController {

    constructor(private eventService: EventService) {}

    @Get()
    @UseGuards(AuthGuard())
    async findAllUserEvents(
        @User() { id }: UserEntity
    ): Promise<EventEntity[]> {
        return this.eventService.findAllUserEvents(id);
    }

}
