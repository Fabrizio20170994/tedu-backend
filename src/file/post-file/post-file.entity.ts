import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../commons/abstract-entity";
import { PostEntity } from "../../post/post.entity";

@Entity('post_file')
export class PostFileEntity extends AbstractEntity{

    @Column('varchar', { length: 255, nullable: false }) 
    key: string;

    @ManyToOne(() => PostEntity, post => post.files, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({name: "post_id"})
    post: PostEntity;

}