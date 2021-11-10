import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../course/course.entity';

@Entity('user_course')
export class UserCourseEntity {
  @ManyToOne(() => UserEntity, (user) => user.userCourses, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.userCourses, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @Column({ default: 0 })
  score: number;
}
