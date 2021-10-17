import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../commons/abstract-entity";

@Entity('comment')
export class CommentEntity extends AbstractEntity{

    @Column('varchar', { length: 255 ,nullable: true })
    text: string;

}