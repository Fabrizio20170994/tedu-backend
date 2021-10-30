import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { AbstractEntity } from "../../commons/abstract-entity";
import { PostEntity } from "../../post/post.entity";

@Entity('message_file')
export class MessageFileEntity extends AbstractEntity{

    @Column('varchar', { length: 255 }) 
    key: string;

    /*
    @ManyToOne(() => MessageEntity, message => message.files, {nullable: false})
    @JoinColumn({name: "message_id"})
    message: MessageEntity;
    */ 
}