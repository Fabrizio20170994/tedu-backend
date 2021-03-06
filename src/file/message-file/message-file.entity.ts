import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../commons/abstract-entity';
import { MessageEntity } from '../../message/message.entity';
import { PostEntity } from '../../post/post.entity';

@Entity('message_file')
export class MessageFileEntity extends AbstractEntity {
  @Column('text', { nullable: false })
  key: string;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @ManyToOne(() => MessageEntity, (message) => message.files, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;
}
