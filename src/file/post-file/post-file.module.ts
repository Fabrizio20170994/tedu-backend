import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { CourseEntity } from '../../course/course.entity';
import { PostEntity } from '../../post/post.entity';
import { PostFileController } from './post-file.controller';
import { PostFileEntity } from './post-file.entity';
import { PostFileService } from './post-file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostFileEntity, PostEntity, CourseEntity]),
    AuthModule,
  ],
  providers: [PostFileService],
  controllers: [PostFileController],
})
export class PostFileModule {}
