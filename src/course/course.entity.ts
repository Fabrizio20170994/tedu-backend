import { PostEntity } from 'src/post/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('course')
export class CourseEntity {

    @PrimaryGeneratedColumn() 
    id: number;

    @Column('int') 
    vacancies: number;

    @Column('varchar', { length: 200, nullable: true })
    desc: string;

    @Column('timestamp without time zone')
    start_date: Date;

    @Column('timestamp without time zone')
    end_date: Date;

    @OneToMany(() => PostEntity, post => post.course, {nullable: true})
    posts: PostEntity[];

}