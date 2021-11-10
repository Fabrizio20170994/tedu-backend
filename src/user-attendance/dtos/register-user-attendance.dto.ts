import { IsBoolean, IsNumber } from 'class-validator';

export class registerUserAttendanceDTO {
  @IsNumber()
  student_id: number;

  @IsBoolean()
  attended: boolean;
}
