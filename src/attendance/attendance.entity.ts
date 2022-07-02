import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../commons/abstract-entity';
import { CourseEntity } from '../course/course.entity';
import { UserAttendanceEntity } from '../user-attendance/user-attendance.entity';

@Entity('attendance')
export class AttendanceEntity extends AbstractEntity {
  @Column({ type: 'timestamp without time zone', name: 'attendance_date' })
  attendance_date: Date;

  @Column({ type: 'timestamp without time zone', name: 'attendance_date_end' })
  attendance_date_end: Date;

  @Column({ default: false })
  registered: boolean;

  @ManyToOne(() => CourseEntity, (course) => course.attendances, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @OneToMany(
    () => UserAttendanceEntity,
    (userAttendance) => userAttendance.attendance,
  )
  userAttendances: UserAttendanceEntity[];
}
