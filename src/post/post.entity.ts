import { CourseEntity } from '../course/course.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../commons/abstract-entity';
import { UserEntity } from '../auth/entities/user.entity';
import { CommentEntity } from '../comment/comment.entity';
import { PostFileEntity } from '../file/post-file/post-file.entity';

@Entity('post')
export class PostEntity extends AbstractEntity {
  @Column('text', { nullable: true })
  text: string;

  @Column({ default: false })
  qualified: boolean;

  @ManyToOne(() => UserEntity, (user) => user.posts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.posts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @OneToMany(() => PostFileEntity, (file) => file.post)
  files: PostFileEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];
}
