import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { UserEntity } from "../auth/entities/user.entity";
import { AbstractEntity } from "../commons/abstract-entity";
import { FileEntity } from "../file/file.entity";
import { PostEntity } from "../post/post.entity";

@Entity('comment')
export class CommentEntity extends AbstractEntity{

    @Column('varchar', { length: 255 ,nullable: true })
    text: string;

    @ManyToOne(() => PostEntity, post => post.comments, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'post_id' })
    post: PostEntity

    @ManyToOne(() => UserEntity, user => user.comments, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity

    @OneToOne(() => FileEntity, { nullable: true })
    @JoinColumn({ name: 'file_id' })
    file: FileEntity;

}