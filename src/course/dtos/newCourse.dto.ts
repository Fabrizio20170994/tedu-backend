import {
  IsArray,
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { schedule } from './schedule.dto';

export class newCourseDTO {
  @IsNumber()
  @Min(0)
  vacancies: number;

  @IsString()
  @MinLength(2)
  @MaxLength(180)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  desc: string;

  @IsDateString({ strict: true })
  start_date: Date;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @Min(1)
  @Max(52)
  weeks: number;

  @IsArray()
  schedule: schedule[];
}
