import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommentEntity } from '../../comment/comment.entity';
import { AbstractEntity } from '../../commons/abstract-entity';

@Entity('comment_file')
export class CommentFileEntity extends AbstractEntity {
  @Column('varchar', { length: 255, nullable: false })
  key: string;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @ManyToOne(() => CommentEntity, (comment) => comment.files, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'comment_id' })
  comment: CommentEntity;
}
