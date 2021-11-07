import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from '../../message/message.entity';
import { FileDTO } from '../file.dto';
import { MessageFileEntity } from './message-file.entity';

@Injectable()
export class MessageFileService {
    constructor (
        @InjectRepository(MessageFileEntity) private messageFileRepository: Repository<MessageFileEntity>,
        @InjectRepository(MessageEntity) private messageRepository: Repository<MessageEntity>,
     ) {}

     async messageFile(userId: number, data: Partial<FileDTO>, messageId: number) {
        const message = await this.messageRepository.findOneOrFail(messageId, {
            relations: ['sender']
        });
        if (message.sender.id != userId) {
            throw new UnauthorizedException("Este mensaje no pertenece al usuario actualmente logeado")
        }
        const fileToCreate = this.messageFileRepository.create();
        fileToCreate.message = message;
        fileToCreate.key = data.key;
        return await this.messageFileRepository.save(fileToCreate);
    }
}
