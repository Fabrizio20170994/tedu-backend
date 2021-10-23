import { Module } from '@nestjs/common';
import { UserAttendanceService } from './user-attendance.service';
import { UserAttendanceController } from './user-attendance.controller';

@Module({
  providers: [UserAttendanceService],
  controllers: [UserAttendanceController]
})
export class UserAttendanceModule {}
