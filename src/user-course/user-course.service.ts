import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AttendanceEntity } from '../attendance/attendance.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';
import { EventDTO } from '../event/dtos/event.dto';
import { EventEntity } from '../event/event.entity';
import { UserAttendanceEntity } from '../user-attendance/user-attendance.entity';
import { UserCourseEntity } from './user-course.entity';

@Injectable()
export class UserCourseService {
  constructor(
    @InjectRepository(UserCourseEntity)
    private userCourseRepository: Repository<UserCourseEntity>,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(UserAttendanceEntity)
    private userAttendanceRepository: Repository<UserAttendanceEntity>,
    @InjectRepository(AttendanceEntity)
    private attendanceRepository: Repository<AttendanceEntity>,
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  async create(
    user_id: number,
    courseCode: string,
  ): Promise<{
    message: string;
    created: boolean;
    vacanciesLeft: number;
  }> {
    const course = await this.courseRepository.findOneOrFail({
      where: { code: courseCode },
    });
    const count = await this.userCourseRepository
      .createQueryBuilder('user_course')
      .where('user_course.course_id = :courseId', { courseId: course.id })
      .getCount();
    const existence = await this.userCourseRepository
      .createQueryBuilder('user_course')
      .where('user_course.user_id = :userId', { userId: user_id })
      .andWhere('user_course.course_id = :courseId', { courseId: course.id })
      .getCount();
    if (existence == 1) {
      return {
        message: `El usuario ${user_id} ya está registrado en el curso ${course.name}`,
        created: false,
        vacanciesLeft: course.vacancies - count,
      };
    }
    if (course.vacancies <= count) {
      return {
        message: `El curso ${course.name} no tiene vacantes disponibles`,
        created: false,
        vacanciesLeft: course.vacancies - count,
      };
    } else {
      const courseWithRelation = await this.courseRepository.findOneOrFail(
        course.id,
        {
          relations: ['teacher'],
        },
      );
      const user = await this.userRepo.findOneOrFail(user_id);
      if (courseWithRelation.teacher.id != user.id) {
        const userCourse = this.userCourseRepository.create();
        userCourse.course = course;
        userCourse.user = user;
        const verification = await this.userCourseRepository.save(userCourse);
        if (verification) {
          this.verificarAsistenciasYAgregar(user, course.id);
          this.synchronizeCalendar(user, course);
          return {
            message: `El usuario ${user_id} fue registrado exitosamente en el curso ${course.name}`,
            created: true,
            vacanciesLeft: course.vacancies - (count + 1),
          };
        } else {
          return {
            message: `Hubo un error inesperado al registrar`,
            created: false,
            vacanciesLeft: course.vacancies - count,
          };
        }
      } else {
        return {
          message: `El usuario ${user_id} ya es profesor del curso ${course.name}`,
          created: false,
          vacanciesLeft: course.vacancies - count,
        };
      }
    }
  }

  /*async update(teacher_id: number, course_id: number, student_id: number): Promise<{
        message: string, 
        updated: boolean,
        currentStudentScore: number;
    }> {
        const verify = await this.courseRepository
        .createQueryBuilder('course')
        .where('course.id = :courseId', {courseId: course_id})
        .andWhere('course.teacher_id = :teacherId', {teacherId: teacher_id})
        .getManyAndCount();
        if(verify[1] <= 0){
            throw new UnauthorizedException('No autorizado para esta operación');
        } 
        const course = verify[0][0];
        const userCourse = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .where('user_course.user_id = :userId', {userId: student_id})
        .andWhere('user_course.course_id = :courseId', {courseId: course_id})
        .getManyAndCount();
        if( userCourse[1] <= 0){
            return {
                message: `Usuario ${student_id} no está registrado en el curso ${course_id}`,
                updated: false,
                currentStudentScore: 0
            };
        }
        const userCourseEntity = userCourse[0][0]
        userCourseEntity.score = userCourseEntity.score + 1;
        userCourseEntity.course = course;
        userCourseEntity.user = await this.userRepo.findOneOrFail(student_id);
        await this.userCourseRepository.save(userCourseEntity);
        return {
            message: `Puntaje del estudiante ${student_id} incrementado en 1 para el curso ${course.name}`,
            updated: true,
            currentStudentScore: userCourseEntity.score
        };
    }*/

  async leaveCourse(
    user_id: number,
    course_id: number,
  ): Promise<{
    message: string;
    deleted: boolean;
  }> {
    const deleteRes: DeleteResult = await this.userCourseRepository
      .createQueryBuilder()
      .delete()
      .from('user_course')
      .where('user_course.user_id = :userId', { userId: user_id })
      .andWhere('user_course.course_id = :courseId', { courseId: course_id })
      .execute();
    if (deleteRes.affected > 0) {
      return {
        message: `Usuario ${user_id} salió del curso ${course_id} satisfactoriamente`,
        deleted: true,
      };
    }
    return {
      message: `El usuario ${user_id} no pudo salir del curso ${course_id}`,
      deleted: false,
    };
  }

  async removeStudent(
    user_id: number,
    student_id: number,
    course_id: number,
  ): Promise<{
    message: string;
    deleted: boolean;
  }> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    if (course.teacher.id == user_id) {
      const deleteRes: DeleteResult = await this.userCourseRepository
        .createQueryBuilder()
        .delete()
        .from('user_course')
        .where('user_course.user_id = :userId', { userId: student_id })
        .andWhere('user_course.course_id = :courseId', { courseId: course_id })
        .execute();
      if (deleteRes.affected > 0) {
        return {
          message: `Estudiante ${student_id} fue eliminado del curso ${course_id} satisfactoriamente`,
          deleted: true,
        };
      }
      return {
        message: `No se pudo eliminar el estudiante ${student_id} del curso ${course_id}`,
        deleted: false,
      };
    } else {
      throw new UnauthorizedException('No autorizado para esta operación');
    }
  }

  async verificarAsistenciasYAgregar(user: UserEntity, course_id: number) {
    const asistenciasRegistradas: AttendanceEntity[] =
      await this.attendanceRepository
        .createQueryBuilder('attendance')
        .where('attendance.course_id = :courseId', { courseId: course_id })
        .andWhere('attendance.registered = :valor', { valor: true })
        .getMany();
    if (asistenciasRegistradas.length > 0) {
      for (const asistencia of asistenciasRegistradas) {
        const userAttendance: UserAttendanceEntity = {
          user: user,
          attended: false,
          attendance: asistencia,
        };
        await this.userAttendanceRepository.save(userAttendance);
      }
    }
  }
  
  /* FUNCTIONS */

  async synchronizeCalendar(
    user: UserEntity,
    course: CourseEntity
  ) {
    const curso = await this.courseRepository.findOneOrFail(course.id, {
      relations: ['attendances']
    });
    const asistencias = curso.attendances;
    if (asistencias.length > 0) {
      for (const asistencia of asistencias) {
        const eventDTO: EventDTO = <EventDTO>{
          course: course,
          start: asistencia.attendance_date,
          end: asistencia.attendance_date_end,
          title: course.name,
          user: user
        };
        await this.eventRepository.save(eventDTO);
      }
    }
  }

}