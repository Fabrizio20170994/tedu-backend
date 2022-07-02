import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { CommentEntity } from '../comment/comment.entity';
import { AbstractEntity } from '../commons/abstract-entity';
import { MessageEntity } from '../message/message.entity';
import { PostEntity } from '../post/post.entity';

export enum NOTIFICATION_TYPE {
  POST = 'POST',
  COMMENT = 'COMMENT',
  MESSAGE = 'MESSAGE',
}

@Entity('notification')
export class NotificationEntity extends AbstractEntity {
  @Column({ default: false })
  seen: Boolean;

  @Column('varchar', { length: 255 })
  text: string;

  @Column('varchar', { length: 20 })
  type: NOTIFICATION_TYPE;

  @ManyToOne(() => UserEntity, (user) => user.notifications, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.notifications, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.notifications, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'comment_id' })
  comment: CommentEntity;

  @ManyToOne(() => MessageEntity, (message) => message.notifications, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;
}
