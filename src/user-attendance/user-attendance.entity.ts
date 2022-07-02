import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AttendanceEntity } from '../attendance/attendance.entity';
import { UserEntity } from '../auth/entities/user.entity';

@Entity('user_attendance')
export class UserAttendanceEntity {
  @ManyToOne(() => UserEntity, (user) => user.userAttendances, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    () => AttendanceEntity,
    (attendance) => attendance.userAttendances,
    { primary: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'attendance_id' })
  attendance: AttendanceEntity;

  @Column({ default: false })
  attended: boolean;
}
