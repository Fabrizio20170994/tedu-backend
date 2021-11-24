import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { AbstractEntity } from '../commons/abstract-entity';
import { MessageFileEntity } from '../file/message-file/message-file.entity';
import { NotificationEntity } from '../notification/notification.entity';

@Entity('message')
export class MessageEntity extends AbstractEntity {
  @Column('text')
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.sentMessages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedMessages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @OneToMany(() => MessageFileEntity, (file) => file.message)
  files: MessageFileEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.message)
  notifications: NotificationEntity[];
}
