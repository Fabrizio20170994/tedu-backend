import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CommentFileEntity } from './entities/comment-file.entity';
import { PostFileEntity } from './entities/post-file.entity';
import { MessageFileEntity } from './entities/message-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentFileEntity, PostFileEntity, MessageFileEntity]), AuthModule],
  providers: [FileService],
  controllers: [FileController]
})
export class FileModule {}
