import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { courseDTO } from './dtos/course.dto';
import { CourseEntity } from './course.entity';
import { newCourseDTO } from './dtos/newCourse.dto';
import { schedule } from './dtos/schedule.dto';
import { attendanceDTO } from '../attendance/dtos/attendance.dto';
import { AttendanceEntity } from '../attendance/attendance.entity';
import { EventEntity } from '../event/event.entity';
import { EventDTO } from '../event/dtos/event.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserCourseEntity)
    private userCourseRepository: Repository<UserCourseEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AttendanceEntity)
    private attendanceRepository: Repository<AttendanceEntity>,
  ) {}

  async findAll(): Promise<CourseEntity[]> {
    return await this.courseRepository.find();
  }

  async findMyCourses(user_id: number): Promise<{
    enrolledCourses: CourseEntity[];
    ownedCourses: CourseEntity[];
  }> {
    /*const userObtained = await this.userRepository.findOneOrFail(user_id, {
            relations: ['courses']
        });
        const temp = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .leftJoinAndSelect('user_course.course', 'course')
        .where('user_course.user_id = :userId', {userId: user_id})
        .getMany();
        const array: CourseEntity[] = [];
        temp.forEach( element => {
            array.push(element.course);
        });
        return {
            enrolledCourses: array,
            ownedCourses: userObtained.courses
        };*/
    const ownedCourses = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .where('course.teacher_id = :teacherId', { teacherId: user_id })
      .getMany();
    const temp = await this.userCourseRepository
      .createQueryBuilder('user_course')
      .leftJoinAndSelect('user_course.course', 'course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .where('user_course.user_id = :userId', { userId: user_id })
      .getMany();
    const array: CourseEntity[] = [];
    temp.forEach((element) => {
      array.push(element.course);
    });
    return {
      enrolledCourses: array,
      ownedCourses: ownedCourses,
    };
  }

  async create(user_id: number, data: newCourseDTO): Promise<CourseEntity> {
    const cursoDTO: courseDTO = <courseDTO>{
      vacancies: data.vacancies,
      name: data.name,
      start_date: data.start_date,
    };
    var daysAhead: number = data.weeks * 8;
    cursoDTO.end_date = this.addDays(new Date(data.start_date), daysAhead);
    if (data.desc != undefined && data.desc.length >= 0 && data.desc != null) {
      cursoDTO.desc = data.desc;
    }
    /*esto da el numero de asistencias a crear*/
    //const attendancesToCreate = data.schedule.length * data.weeks;
    /**/
    const curso = this.courseRepository.create(cursoDTO);
    const teacher = await this.userRepository.findOneOrFail(user_id);
    curso.teacher = teacher;
    const cursoCreado = await this.courseRepository.save(curso);
    await this.createAttendances(
      cursoCreado,
      new Date(data.start_date),
      data.weeks,
      data.schedule,
    );
    return cursoCreado;
  }

  async findById(user_id: number, course_id: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    //const user = await this.userRepository.findOneOrFail(user_id);
    const userCourse = await this.userCourseRepository
      .createQueryBuilder('user_course')
      .where('user_course.user_id = :userId', { userId: user_id })
      .andWhere('user_course.course_id = :courseId', { courseId: course_id })
      .getCount();
    if (course.teacher.id == user_id || userCourse > 0) {
      return course;
    } else {
      throw new UnauthorizedException('No autorizado para esta operación');
    }
  }

  //Considerar cambiar el update a un queryBuilder para ahi validar de frente si es profe del curso
  //Como en el update del post service
  async updateById(
    user_id: number,
    course_id: number,
    data: Partial<courseDTO>,
  ): Promise<{
    message: string;
    updated: boolean;
  }> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    //const user = await this.userRepository.findOneOrFail(user_id);   //if(course.teacher.id == user.id){
    if (course.teacher.id == user_id) {
      if (data.vacancies != null) {
        if (data.vacancies < 0) {
          return {
            message: `Nuevo número de vacantes no puede ser negativo`,
            updated: false,
          };
        }
        const count = await this.userCourseRepository
          .createQueryBuilder('user_course')
          .where('user_course.course_id = :courseId', { courseId: course.id })
          .getCount();
        if (count > data.vacancies) {
          return {
            message: `Nuevo número de vacantes no puede ser menor al número de estudiantes actualmente matriculados`,
            updated: false,
          };
        }
      }
      const updateRes = await this.courseRepository.update(course_id, data);
      if (updateRes.affected > 0) {
        return {
          message: `El curso ${course.id} ha sido actualizado correctamente`,
          updated: true,
        };
      } else {
        return {
          message: `El curso ${course.id} no ha sido actualizado`,
          updated: false,
        };
      }
    } else {
      return {
        message: `El usuario ${user_id} no es profesor del curso ${course.id}`,
        updated: false,
      };
    }
  }

  async delete(
    user_id: number,
    course_id: number,
  ): Promise<{
    message: string;
    deleted: boolean;
  }> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    if (course.teacher.id == user_id) {
      const deleteRes = await this.courseRepository.delete(course_id);
      if (deleteRes.affected > 0) {
        return {
          message: `El curso ${course_id} fue eliminado satisfactoriamente`,
          deleted: true,
        };
      } else {
        return {
          message: `El curso ${course.id} no pudo ser eliminado`,
          deleted: false,
        };
      }
    } else {
      throw new UnauthorizedException('No autorizado para esta operación');
    }
  }

  async getMembers(
    user_id: number,
    course_id: number,
  ): Promise<{
    teacher: UserEntity;
    students: {}[];
  }> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    const userCourse = await this.userCourseRepository
      .createQueryBuilder('user_course')
      .where('user_course.user_id = :userId', { userId: user_id })
      .andWhere('user_course.course_id = :courseId', { courseId: course_id })
      .getCount();
    if (course.teacher.id == user_id || userCourse > 0) {
      const temp = await this.userCourseRepository
        .createQueryBuilder('user_course')
        .leftJoinAndSelect('user_course.user', 'user')
        .where('user_course.course_id = :courseId', { courseId: course_id })
        .getMany();
      //const students: UserEntity[] = [];
      const students: {}[] = [];
      temp.forEach((element) => {
        students.push({ ...element.user.toJson(), score: element.score });
      });
      return {
        teacher: course.teacher,
        students: students,
      };
    } else {
      throw new UnauthorizedException('No autorizado para esta operación');
    }
  }

  /*
    async findCoursePostsById(id: number): Promise<CourseEntity> {
        return await this.courseRepository.findOneOrFail(id, {
            relations: ['posts']
        });
    }*/

  /*********** FUNCTIONS ************/

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  setHoursMinutesSeconds(
    date: Date,
    hours: number,
    minutes: number,
    seconds: number,
  ): Date {
    date.setHours(hours, minutes, seconds);
    return date;
  }

  /*addMinutes(date: Date, minutes: number): Date {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }*/
  /*substractMinutes(end: string, start: string): number {
    var value_end = end.split(':');
    var value_start = start.split(':');
    if(value_end[0] < value_start[0]){
      throw new BadRequestException('La hora de fin no puede ser menor a la hora de inicio')
    }
    const minutesEnd = parseInt(value_end[0], 10) * 60 + parseInt(value_end[1], 10);
    const minutesStart = parseInt(value_start[0], 10) * 60 + parseInt(value_start[1], 10);
    return minutesEnd - minutesStart;
  }*/

  substractHoursAndMinutes(cadena: string): number[] {
    const datos = cadena.split(':');
    return [parseInt(datos[0], 10), parseInt(datos[1], 10)];
  }

  async createAttendances(
    course: CourseEntity,
    courseStartDate: Date,
    weeks: number,
    schedule: schedule[],
  ) {
    var dateMark = courseStartDate;
    const scheduleFlagLast = schedule.length;
    var scheduleFlagFirst = 0;
    /**/
    const attendanceDTO: attendanceDTO = <attendanceDTO>{};
    /**/
    if (dateMark.getDay() > schedule[scheduleFlagFirst].day) {
      dateMark = this.addDays(dateMark, 7 - dateMark.getDay());
    } else if (dateMark.getDay() < schedule[scheduleFlagFirst].day) {
      dateMark = this.addDays(dateMark, -dateMark.getDay());
    }
    for (var i = 0; i < weeks; i++) {
      for (var j = 0; j < 7; j++) {
        if (scheduleFlagFirst < scheduleFlagLast) {
          if (dateMark.getDay() == schedule[scheduleFlagFirst].day) {
            //attendanceDTO.attendance_date = dateMark;
            const startTimeArray = this.substractHoursAndMinutes(
              schedule[scheduleFlagFirst].start,
            );
            const endTimeArray = this.substractHoursAndMinutes(
              schedule[scheduleFlagFirst].end,
            );
            attendanceDTO.attendance_date = new Date(
              this.setHoursMinutesSeconds(
                dateMark,
                startTimeArray[0],
                startTimeArray[1],
                0,
              ),
            );
            attendanceDTO.attendance_date_end = new Date(
              this.setHoursMinutesSeconds(
                dateMark,
                endTimeArray[0],
                endTimeArray[1],
                0,
              ),
            );
            attendanceDTO.registered = false;
            const attendanceToSave =
              this.attendanceRepository.create(attendanceDTO);
            attendanceToSave.course = course;
            await this.attendanceRepository.save(attendanceToSave);
            dateMark = this.addDays(dateMark, 1);
            scheduleFlagFirst += 1;
          } else {
            dateMark = this.addDays(dateMark, 1);
          }
        } else {
          scheduleFlagFirst = 0;
          dateMark = this.addDays(dateMark, 1);
        }
      }
    }
  }
}
