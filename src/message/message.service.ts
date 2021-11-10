import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeStream, Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { MessageDTO } from './dtos/message.dto';
import { MessageEntity } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async send(userId: number, data: Partial<MessageDTO>) {
    if (userId == data.userId) {
      throw new BadRequestException('No se puede enviar un mensaje a sí mismo');
    }
    const sender = await this.userRepository.findOneOrFail(userId);
    const receiver = await this.userRepository.findOneOrFail(data.userId);

    const text = data.text;

    return await this.messageRepository.save({
      text,
      sender,
      receiver,
    });
  }

  async getAllMessages(loggedUser: number, messagedUser: number) {
    const senderMessages = await this.getSenderMessages(
      loggedUser,
      messagedUser,
    );
    const receivedMessages = await this.getReceiverMessages(
      messagedUser,
      loggedUser,
    );

    return senderMessages.concat(receivedMessages);
  }

  async getSenderMessages(sender: number, receiver: number) {
    return await this.messageRepository.find({
      where: { sender, receiver },
      relations: ['receiver', 'sender'],
    });
  }

  async getReceiverMessages(receiver: number, sender: number) {
    return await this.messageRepository.find({
      where: { sender, receiver },
      relations: ['receiver', 'sender'],
    });
  }

  async delete(senderId: number, messageId: number) {
    const message = await this.messageRepository.findOneOrFail(messageId, {
      relations: ['sender'],
    });
    if (senderId != message.sender.id) {
      throw new UnauthorizedException(
        'El usuario actualmente logeado no es el emisor del mensaje',
      );
    }
    const deleted = await this.messageRepository.delete(messageId);
    if (deleted.affected) {
      return {
        message: `El mensaje ${messageId} fue eliminado`,
        deleted: true,
      };
    }
    return {
      message: `El mensaje ${messageId} no pudo ser eliminado`,
      deleted: false,
    };
  }

  async users(userId: number) {
    const user = await this.userRepository.findOne(userId);

    let messages = await this.messageRepository.find({
      where: [{ receiver: user }, { sender: user }],
      relations: ['receiver', 'sender'],
    });

    const senders = messages.map((message) => message.sender);

    const receivers = messages.map((message) => message.receiver);

    let users = senders.concat(receivers);

    users = users.filter(
      (user, index, self) => index === self.findIndex((t) => t.id === user.id),
    );

    return users;
  }
}
