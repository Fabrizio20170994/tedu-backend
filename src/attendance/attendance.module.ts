import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AttendanceEntity } from './attendance.entity';
import { CourseEntity } from '../course/course.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendanceEntity,
      CourseEntity,
      UserEntity,
      UserCourseEntity,
    ]),
    AuthModule,
  ],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
