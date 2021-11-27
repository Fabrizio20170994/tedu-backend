import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../../comment/comment.entity';
import { CourseEntity } from '../../course/course.entity';
import { PostEntity } from '../../post/post.entity';
import { FileDTO } from '../file.dto';
import { CommentFileEntity } from './comment-file.entity';

@Injectable()
export class CommentFileService {
  constructor(
    @InjectRepository(CommentFileEntity)
    private commentFileRepository: Repository<CommentFileEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
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
    fileToCreate.name = data.name;
    return await this.commentFileRepository.save(fileToCreate);
  }

  async delete(
    userId: number,
    courseId: number,
    postId: number,
    commentId: number,
    fileId: number,
  ) {
    const course = await this.courseRepository.findOneOrFail(courseId);

    const post = await this.postRepository.findOneOrFail(postId, {
      relations: ['course', 'user'],
    });

    if (post.course.id != course.id) {
      throw new UnauthorizedException(
        'La publicación ingresada no pertenece al curso ingresado',
      );
    }

    const comment = await this.commentRepository.findOneOrFail(commentId, {
      relations: ['post', 'user'],
    });

    if (comment.post.id != post.id) {
      throw new UnauthorizedException(
        'El comentario no pertenece a la publicación ingresada',
      );
    }

    if (comment.user.id != userId) {
      throw new UnauthorizedException('No autorizado para esta operación');
    }

    const file = await this.commentFileRepository.findOneOrFail(fileId, {
      relations: ['comment'],
    });

    if (file.comment.id != post.id) {
      throw new UnauthorizedException(
        'El archivo no pertenece al comentario ingresado',
      );
    }

    const deleteRes = await this.commentFileRepository.delete(fileId);

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
