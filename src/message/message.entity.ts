import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "../auth/entities/user.entity";
import { AbstractEntity } from "../commons/abstract-entity";
import { MessageFileEntity } from "../file/message-file/message-file.entity";

@Entity('message')
export class MessageEntity extends AbstractEntity{

    @Column('text') 
    text: string;

    @ManyToOne(() => UserEntity, user => user.sentMessages, {nullable: false})
    @JoinColumn({name: "sender_id"})
    sender: UserEntity;

    @ManyToOne(() => UserEntity, user => user.receivedMessages, {nullable: false})
    @JoinColumn({name: "receiver_id"})
    receiver: UserEntity;
    
    @OneToMany(() => MessageFileEntity, file => file.message)
    files: MessageFileEntity[]
}