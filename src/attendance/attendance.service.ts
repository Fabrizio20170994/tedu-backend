import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { AttendanceEntity } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceEntity)
    private attendanceRepository: Repository<AttendanceEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserCourseEntity)
    private userCourseRepository: Repository<CourseEntity>,
  ) {}

  async findCourseAttendances(
    user_id: number,
    course_id: number,
  ): Promise<AttendanceEntity[]> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });

    const user = await this.userRepository.findOneOrFail(user_id);
    const userCourse = await this.userCourseRepository.findOne({
      where: {
        user,
        course,
      },
    });
    // Si el usuario es el profesor o un usuario del curso, mostrar la asistencia
    if (course.teacher.id == user_id || userCourse) {
      return await this.attendanceRepository
        .createQueryBuilder('attendance')
        .where('attendance.course_id = :courseId', { courseId: course_id })
        .getMany();
    } else {
      throw new UnauthorizedException(
        'Usuario no autorizado para esta operación',
      );
    }
  }

  async findCourseAttendanceById(
    user_id: number,
    course_id: number,
    attendance_id: number,
  ): Promise<AttendanceEntity> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    const user = await this.userRepository.findOneOrFail(user_id);
    const userCourse = await this.userCourseRepository.findOne({
      where: {
        user,
        course,
      },
    });
    // Si el usuario es el profesor o un usuario del curso, mostrar la asistencia
    if (course.teacher.id == user_id || userCourse) {
      return await this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.userAttendances', 'userAttendances')
        .leftJoinAndSelect('userAttendances.user', 'user')
        .where('attendance.id = :attendanceId', { attendanceId: attendance_id })
        .getOneOrFail();
    } else {
      throw new UnauthorizedException(
        'Usuario no autorizado para esta operación',
      );
    }
  }
}
