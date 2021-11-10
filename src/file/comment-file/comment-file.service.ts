import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../../comment/comment.entity';
import { FileDTO } from '../file.dto';
import { CommentFileEntity } from './comment-file.entity';

@Injectable()
export class CommentFileService {
  constructor(
    @InjectRepository(CommentFileEntity)
    private commentFileRepository: Repository<CommentFileEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async commentFile(userId: number, data: Partial<FileDTO>, commentId: number) {
    const comment = await this.commentRepository.findOneOrFail(commentId, {
      relations: ['user'],
    });
    if (comment.user.id != userId) {
      throw new UnauthorizedException(
        'Este comentario no pertenece al usuario actualmente logeado',
      );
    }
    const fileToCreate = this.commentFileRepository.create();
    fileToCreate.comment = comment;
    fileToCreate.key = data.key;
    return await this.commentFileRepository.save(fileToCreate);
  }
}
