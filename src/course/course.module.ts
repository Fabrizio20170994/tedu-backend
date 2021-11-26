import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from '../attendance/attendance.entity';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../auth/entities/user.entity';
import { EventEntity } from '../event/event.entity';
import { PostEntity } from '../post/post.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { CourseController } from './course.controller';
import { CourseEntity } from './course.entity';
import { CourseService } from './course.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      PostEntity,
      UserCourseEntity,
      UserEntity,
      AttendanceEntity,
      EventEntity
    ]),
    AuthModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
