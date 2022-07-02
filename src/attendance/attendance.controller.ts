import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { AttendanceEntity } from './attendance.entity';
import { AttendanceService } from './attendance.service';

@Controller('courses/:course_id/attendances')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Get()
  @UseGuards(AuthGuard())
  async obtenerAsistenciasDeCurso(
    @User() { id }: UserEntity,
    @Param('course_id') course_id: number,
  ): Promise<AttendanceEntity[]> {
    return this.attendanceService.findCourseAttendances(id, course_id);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async obtenerAsistenciaDeCursoPorId(
    @User() { id }: UserEntity,
    @Param('course_id') course_id: number,
    @Param('id') attendance_id: number,
  ): Promise<AttendanceEntity> {
    return this.attendanceService.findCourseAttendanceById(
      id,
      course_id,
      attendance_id,
    );
  }
}
