import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { AuthModule } from '../auth/auth.module';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { CourseEntity } from '../course/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity, 
      PostEntity,
      UserEntity,
      UserCourseEntity,
      CourseEntity
    ]), 
    AuthModule
  ],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule {}
