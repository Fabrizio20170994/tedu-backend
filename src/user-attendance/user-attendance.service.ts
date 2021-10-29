import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceEntity } from '../attendance/attendance.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';
import { registerUserAttendanceDTO } from './dtos/register-user-attendance.dto';
import { UserAttendanceEntity } from './user-attendance.entity';

@Injectable()
export class UserAttendanceService {

    constructor(
        @InjectRepository(UserAttendanceEntity) private userAttendanceRepository: Repository<UserAttendanceEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
        @InjectRepository(AttendanceEntity) private attendanceRepository: Repository<AttendanceEntity>
    ) {}

    async registerAttendance(
        user_id: number,
        course_id: number,
        attendance_id: number,
        data: registerUserAttendanceDTO[]
    ): Promise<{
        message: string;
        registered: boolean; 
    }> {
        //TRABAJAR EN CASO POR EJ NO HAYA ALUMNOS EN EL CURSO CUANDO SE QUIERA PASAR LISTA
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        if(course.teacher.id == user_id){
            const asistenciaLista = await this.attendanceRepository.findOneOrFail(attendance_id);
            if(asistenciaLista.registered == true){
                throw new BadRequestException({ registered: asistenciaLista.registered, attendance_date: asistenciaLista.attendance_date } ,'Esta asistencia ya está marcada como "registrada"')
            } else{
                const listaUserAttendances: UserAttendanceEntity[] = [];
                data.forEach(async userAElement => {
                    const user = await this.userRepository.findOneOrFail(userAElement.student_id);
                    const userAttendance: UserAttendanceEntity = {
                        user: user,
                        attended: userAElement.attended,
                        attendance: asistenciaLista
                    }
                    listaUserAttendances.push(userAttendance);
                    /*const userAttendance = this.userAttendanceRepository.create();
                    userAttendance.attended = userAElement.attended;
                    userAttendance.user = user;
                    userAttendance.attendance = asistenciaLista;*/
                });
                await this.userAttendanceRepository.save(listaUserAttendances);
                asistenciaLista.registered = true;
                await this.attendanceRepository.save(asistenciaLista);
                return {
                    message: `la relación de ${listaUserAttendances.length} alumnos con la lista ${asistenciaLista.id} se creó correctamente`,
                    registered: true
                };
            }
        } else{
            throw new UnauthorizedException('No autorizado para esta operación');
        }
    }

}
