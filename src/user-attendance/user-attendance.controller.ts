import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { registerUserAttendanceDTO } from './dtos/register-user-attendance.dto';
import { UserAttendanceService } from './user-attendance.service';

@Controller('courses/:course_id/attendances/:attendance_id')
export class UserAttendanceController {
  constructor(private userAttendanceService: UserAttendanceService) {}

  @Post('register')
  @UseGuards(AuthGuard())
  async tomarLista(
    @User() { id }: UserEntity,
    @Param('course_id') course_id: number,
    @Param('attendance_id') attendance_id: number,
    @Body(ValidationPipe) data: registerUserAttendanceDTO[],
  ): Promise<{
    message: string;
    registered: boolean;
  }> {
    //@Body() data: Partial<courseDTO>
    return this.userAttendanceService.registerAttendance(
      id,
      course_id,
      attendance_id,
      data,
    );
  }

  @Put('edit')
  @UseGuards(AuthGuard())
  async editarLista(
    @User() { id }: UserEntity,
    @Param('course_id') course_id: number,
    @Param('attendance_id') attendance_id: number,
    @Body(ValidationPipe) data: registerUserAttendanceDTO[],
  ) {
    return this.userAttendanceService.editAttendance(
      id,
      course_id,
      attendance_id,
      data,
    );
  }
}
