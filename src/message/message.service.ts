import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeStream, Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { MessageFileEntity } from '../file/message-file/message-file.entity';
import {
  NotificationEntity,
  NOTIFICATION_TYPE,
} from '../notification/notification.entity';
import { messageDTO } from './dto/message.dto';
import { MessageEntity } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(MessageFileEntity)
    private messageFileRepository: Repository<MessageFileEntity>,
  ) {}

  async send(senderId: number, data: messageDTO, receiverId: number) {
    if (senderId == receiverId) {
      throw new BadRequestException('No se puede enviar un mensaje a sí mismo');
    }
    const sender = await this.userRepository.findOneOrFail(senderId);
    const receiver = await this.userRepository.findOneOrFail(receiverId);

    const message = await this.messageRepository.save({
      text: data.text,
      sender,
      receiver,
    });

    // Adjuntar Archivos
    if (data.files) {
      for (const file of data.files) {
        const fileToCreate = this.messageFileRepository.create();
        fileToCreate.message = message;
        fileToCreate.key = file.key;
        fileToCreate.name = file.name;
        await this.messageFileRepository.save(fileToCreate);
      }
    }

    await this.notificationRepository.save({
      message,
      user: receiver,
      text: `Has recibido un mensaje de ${sender.name}`,
      type: NOTIFICATION_TYPE.MESSAGE,
    });

    return this.messageRepository.findOneOrFail(message.id, {
      relations: ['files'],
    });
  }

  async getAllMessages(loggedUser: number, messagedUser: number) {
    const senderMessages = await this.getSenderMessages(
      loggedUser,
      messagedUser,
    );
    const receivedMessages = await this.getReceiverMessages(
      loggedUser,
      messagedUser,
    );

    return senderMessages.concat(receivedMessages);
  }

  async getSenderMessages(sender: number, receiver: number) {
    return await this.messageRepository.find({
      where: { sender, receiver },
      relations: ['receiver', 'sender', 'files'],
    });
  }

  async getReceiverMessages(receiver: number, sender: number) {
    return await this.messageRepository.find({
      where: { sender, receiver },
      relations: ['receiver', 'sender', 'files'],
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
