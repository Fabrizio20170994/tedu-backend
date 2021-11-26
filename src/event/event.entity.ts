import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { AbstractEntity } from '../commons/abstract-entity';
import { CourseEntity } from '../course/course.entity';

@Entity('event')
export class EventEntity extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @ManyToOne(() => CourseEntity, (course) => course.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => UserEntity, (user) => user.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
