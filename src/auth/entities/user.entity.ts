import { classToPlain, Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../commons/abstract-entity';
import { UserCourseEntity } from '../../user-course/user-course.entity';
import { CourseEntity } from '../../course/course.entity';
import { PostEntity } from '../../post/post.entity';
import { CommentEntity } from '../../comment/comment.entity';
import { UserAttendanceEntity } from '../../user-attendance/user-attendance.entity';
import { MessageEntity } from '../../message/message.entity';
import { NotificationEntity } from '../../notification/notification.entity';
import { EventEntity } from '../../event/event.entity';

@Entity('user')
export class UserEntity extends AbstractEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 50 })
  institution: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, length: 15 })
  phone: string;

  @Column({ length: 120 })
  @Exclude()
  password: string;

  @OneToMany(() => CourseEntity, (course) => course.teacher, { nullable: true })
  courses: CourseEntity[];

  @OneToMany(() => PostEntity, (post) => post.user, { nullable: true })
  posts: PostEntity[];

  @OneToMany(() => UserCourseEntity, (userCourse) => userCourse.user)
  userCourses: UserCourseEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(
    () => UserAttendanceEntity,
    (userAttendance) => userAttendance.user,
  )
  userAttendances: UserAttendanceEntity[];

  @OneToMany(() => MessageEntity, (message) => message.receiver)
  receivedMessages: MessageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.receiver)
  sentMessages: MessageEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => EventEntity, (event) => event.user)
  events: EventEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toJson() {
    return classToPlain(this);
  }
}
