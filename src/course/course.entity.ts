import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttendanceEntity } from '../attendance/attendance.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { AbstractEntity } from '../commons/abstract-entity';
import { EventEntity } from '../event/event.entity';
import { PostEntity } from '../post/post.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';

@Entity('course')
export class CourseEntity extends AbstractEntity {
  @Column()
  @Generated('uuid')
  code: string;

  @Column('int', { default: 0 })
  vacancies: number;

  @Column('varchar', { length: 80 })
  name: string;

  @Column('varchar', { length: 200, nullable: true })
  desc: string;

  @Column('timestamp without time zone' /*, {default: Date.now()}*/)
  start_date: Date;

  @Column('timestamp without time zone')
  end_date: Date;

  @ManyToOne(() => UserEntity, (user) => user.courses, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: UserEntity;

  @OneToMany(() => PostEntity, (post) => post.course, { nullable: true })
  posts: PostEntity[];

  @OneToMany(() => UserCourseEntity, (userCourse) => userCourse.course)
  userCourses: UserCourseEntity[];

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.course)
  attendances: AttendanceEntity[];

  @OneToMany(() => EventEntity, (event) => event.course)
  events: EventEntity[];
}
