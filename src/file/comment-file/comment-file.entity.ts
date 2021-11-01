import { Column, Entity, JoinColumn, ManyToOne, } from "typeorm";
import { CommentEntity } from "../../comment/comment.entity";
import { AbstractEntity } from "../../commons/abstract-entity";

@Entity('comment_file')
export class CommentFileEntity extends AbstractEntity{

    @Column('varchar', { length: 255 }) 
    key: string;

    @ManyToOne(() => CommentEntity, comment => comment.files, {nullable: false})
    @JoinColumn({name: "comment_id"})
    comment: CommentEntity;
}