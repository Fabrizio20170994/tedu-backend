import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceEntity } from '../attendance/attendance.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';
import { editUserAttendanceDTO } from './dtos/edit-user-attendance.dto';
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
        //Tirar error
        if (course.teacher.id != user_id) {
            throw new UnauthorizedException('No autorizado para esta operación');
        }
        //actualizar
        const asistenciaLista = await this.attendanceRepository.findOneOrFail(attendance_id);
        if (asistenciaLista.registered) {
            throw new BadRequestException({ registered: asistenciaLista.registered, attendance_date: asistenciaLista.attendance_date }, 'Esta asistencia ya está marcada como "registrada"')
        }
        var created = 0;
        for (const userAElement of data) {
            const user = await this.userRepository.findOneOrFail(userAElement.student_id);
            const userAttendance: UserAttendanceEntity = {
                user: user,
                attended: userAElement.attended,
                attendance: asistenciaLista
            }
            await this.userAttendanceRepository.save(userAttendance).then( _ => {
                created += 1;
            });
        }
        asistenciaLista.registered = true;
        await this.attendanceRepository.save(asistenciaLista);
        return {
            message: `la relación de ${created} alumnos con la lista ${asistenciaLista.id} se creó correctamente`,
            registered: true
        };
    }

    async editAttendance(
        user_id: number,
        course_id: number,
        attendance_id: number,
        data: registerUserAttendanceDTO[]
    ) {
        const course = await this.courseRepository.findOneOrFail(course_id, {
            relations: ['teacher']
        });
        if(course.teacher.id != user_id){
            throw new UnauthorizedException('No autorizado para esta operación');
        }
        const asistenciaLista = await this.attendanceRepository.findOneOrFail(attendance_id);
        if (asistenciaLista.registered == false) {
            throw new BadRequestException({ registered: asistenciaLista.registered, attendance_date: asistenciaLista.attendance_date }, 'No se puede editar una asistencia que no ha sido "registrada"');
        }
        var updatedRows: number = 0;
        for (const element of data) {
            const userAttendance: editUserAttendanceDTO = {
                attended: element.attended,
            }
            const updatedRes = await this.userAttendanceRepository
                .createQueryBuilder()
                .update('user_attendance')
                .set(userAttendance)
                .where('user_attendance.user_id = :userId', { userId: element.student_id })
                .andWhere('user_attendance.attendance_id = :attendanceId', { attendanceId: asistenciaLista.id })
                .execute();
            updatedRows = updatedRows + updatedRes.affected;
        }
        if (updatedRows > 0) {
            return {
                message: `Se actualizaron ${updatedRows} alumnos en esta lista de Asistencia`,
                updated: true
            };
        }
        return {
            message: `Se actualizaron ${updatedRows} alumnos en esta lista de Asistencia`,
            updated: false
        };
    }
    

}
