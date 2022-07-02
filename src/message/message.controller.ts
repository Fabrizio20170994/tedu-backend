import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { messageDTO } from './dto/message.dto';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('/:userId')
  @UseGuards(AuthGuard())
  async sendMessage(
    @User() { id }: UserEntity,
    @Body() data: messageDTO,
    @Param('userId') userId: number,
  ) {
    return this.messageService.send(id, data, userId);
  }

  @Get('/users')
  @UseGuards(AuthGuard())
  async messagedUsers(@User() { id }: UserEntity) {
    return this.messageService.users(id);
  }

  @Get('/:userId')
  @UseGuards(AuthGuard())
  async allMessages(
    @User() { id }: UserEntity,
    @Param('userId') userId: number,
  ) {
    return this.messageService.getAllMessages(id, userId);
  }

  @Get('/:userId/incoming')
  @UseGuards(AuthGuard())
  async incomingMessages(
    @User() { id }: UserEntity,
    @Param('userId') userId: number,
  ) {
    return this.messageService.getReceiverMessages(id, userId);
  }

  @Get('/:userId/outgoing')
  @UseGuards(AuthGuard())
  async outgoingMessages(
    @User() { id }: UserEntity,
    @Param('userId') userId: number,
  ) {
    return this.messageService.getSenderMessages(id, userId);
  }

  @Delete('/:messageId')
  @UseGuards(AuthGuard())
  async deleteMessages(
    @User() { id }: UserEntity,
    @Param('messageId') messageId: number,
  ) {
    return this.messageService.delete(id, messageId);
  }
}
