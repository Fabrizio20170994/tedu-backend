import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../auth/entities/user.entity';
import { CommentEntity } from '../comment/comment.entity';
import { CourseEntity } from '../course/course.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { PostController } from './post.controller';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity, 
      CourseEntity, 
      UserEntity, 
      UserCourseEntity,
      CommentEntity
    ]), 
    AuthModule
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
