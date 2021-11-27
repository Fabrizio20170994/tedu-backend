import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../post/post.entity';
import { FileDTO } from '../file.dto';
import { PostFileEntity } from './post-file.entity';

@Injectable()
export class PostFileService {
  constructor(
    @InjectRepository(PostFileEntity)
    private postFileRepository: Repository<PostFileEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async postFile(userId: number, data: Partial<FileDTO>, postId: number) {
    const post = await this.postRepository.findOneOrFail(postId, {
      relations: ['user'],
    });
    if (post.user.id != userId) {
      throw new UnauthorizedException(
        'Esta publicación no pertenece al usuario actualmente logeado',
      );
    }
    const fileToCreate = this.postFileRepository.create();
    fileToCreate.post = post;
    fileToCreate.key = data.key;
    fileToCreate.name = data.name;
    return await this.postFileRepository.save(fileToCreate);
  }

  async delete(
    userId: number,
    courseId: number,
    postId: number,
    fileId: number,
  ) {
    const post = await this.postRepository.findOne(postId, {
      relations: ['course', 'user'],
    });

    if (post.course.id != courseId) {
      throw new UnauthorizedException(
        'La publicación ingresada no pertenece al curso ingresado',
      );
    }

    if (post.user.id != userId) {
      throw new UnauthorizedException(
        'La publicación ingresada no pertenece al usuario actualmente logeado',
      );
    }

    const file = await this.postFileRepository.findOne(fileId, {
      relations: ['post'],
    });

    if (file.post.id != postId) {
      throw new UnauthorizedException(
        'El archivo no pertenece a la publicación ingresada',
      );
    }

    const deleteRes = await this.postFileRepository.delete(fileId);

    if (deleteRes.affected > 0) {
      return {
        message: `El archivo con ${fileId} ha sido eliminado correctamente`,
        deleted: true,
      };
    }
    return {
      message: `El comentario ${fileId} no pudo ser eliminado`,
      deleted: false,
    };
  }
}
