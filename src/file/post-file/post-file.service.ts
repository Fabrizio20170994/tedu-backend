import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../post/post.entity';
import { FileDTO } from '../file.dto';
import { PostFileEntity } from './post-file.entity';

@Injectable()
export class PostFileService {
    constructor (
        @InjectRepository(PostFileEntity) private postFileRepository: Repository<PostFileEntity>,
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
     ) {}

     async postFile(userId: number, data: Partial<FileDTO>, postId: number) {
        const post = await this.postRepository.findOneOrFail(postId, {
            relations: ['user']
        });
        if (post.user.id != userId) {
            throw new UnauthorizedException("Esta publicación no pertenece al usuario actualmente logeado")
        }
        const fileToCreate = this.postFileRepository.create();
        fileToCreate.post = post;
        fileToCreate.key = data.key;
        return await this.postFileRepository.save(fileToCreate);
    }
}
