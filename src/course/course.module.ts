import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from '../attendance/attendance.entity';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../auth/entities/user.entity';
import { EventEntity } from '../event/event.entity';
import { PostEntity } from '../post/post.entity';
import { UserAttendanceEntity } from '../user-attendance/user-attendance.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { UserCourseModule } from '../user-course/user-course.module';
import { UserCourseService } from '../user-course/user-course.service';
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
      EventEntity,
      UserAttendanceEntity,
    ]),
    AuthModule,
    UserCourseModule,
  ],
  controllers: [CourseController],
  providers: [CourseService, UserCourseService],
})
export class CourseModule {}
