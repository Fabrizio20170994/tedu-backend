import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { CommentEntity } from '../../comment/comment.entity';
import { CommentFileController } from './comment-file.controller';
import { CommentFileEntity } from './comment-file.entity';
import { CommentFileService } from './comment-file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentFileEntity, CommentEntity]),
    AuthModule,
  ],
  providers: [CommentFileService],
  controllers: [CommentFileController],
})
export class CommentFileModule {}
