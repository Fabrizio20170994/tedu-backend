import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { AbstractEntity } from '../commons/abstract-entity';
import { CommentFileEntity } from '../file/comment-file/comment-file.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { PostEntity } from '../post/post.entity';

@Entity('comment')
export class CommentEntity extends AbstractEntity {
  @Column('varchar', { length: 255, nullable: true })
  text: string;

  @Column({ default: false })
  qualified: boolean;

  @ManyToOne(() => PostEntity, (post) => post.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => CommentFileEntity, (file) => file.comment)
  files: CommentFileEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.comment)
  notifications: NotificationEntity[];
}
