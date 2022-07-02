import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { EventDTO } from './dtos/event.dto';
import { EventEntity } from './event.entity';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post()
  @UseGuards(AuthGuard())
  async createEvent(
    @User() { id }: UserEntity,
    @Body(ValidationPipe) data: EventDTO,
  ): Promise<EventEntity> {
    return this.eventService.createEvent(id, data);
  }

  @Get()
  @UseGuards(AuthGuard())
  async findAllUserEvents(@User() { id }: UserEntity): Promise<EventEntity[]> {
    return this.eventService.findAllUserEvents(id);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  async findUserEventById(
    @User() { id }: UserEntity,
    @Param('id') event_id: number,
  ): Promise<EventEntity> {
    return this.eventService.findUserEventById(id, event_id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async deleteEvent(
    @User() { id }: UserEntity,
    @Param('id') event_id: number,
  ): Promise<{
    message: string;
    deleted: boolean;
  }> {
    return this.eventService.deleteEvent(id, event_id);
  }
}
