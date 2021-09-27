import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';
import { UserCourseController } from './user-course.controller';
import { UserCourseEntity } from './user-course.entity';
import { UserCourseService } from './user-course.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserCourseEntity, CourseEntity, UserEntity])],
  controllers: [UserCourseController],
  providers: [UserCourseService]
})
export class UserCourseModule {}
