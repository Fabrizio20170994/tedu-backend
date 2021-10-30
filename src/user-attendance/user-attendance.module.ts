import { Module } from '@nestjs/common';
import { UserAttendanceService } from './user-attendance.service';
import { UserAttendanceController } from './user-attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserAttendanceEntity } from './user-attendance.entity';
import { AttendanceEntity } from '../attendance/attendance.entity';
import { CourseEntity } from '../course/course.entity';
import { UserEntity } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserAttendanceEntity,
      AttendanceEntity,
      CourseEntity,
      UserEntity
    ]),
    AuthModule
  ],
  providers: [UserAttendanceService],
  controllers: [UserAttendanceController]
})
export class UserAttendanceModule {}
