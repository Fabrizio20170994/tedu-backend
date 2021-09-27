import { CourseEntity } from '../course/course.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../commons/abstract-entity';

@Entity('post')
export class PostEntity extends AbstractEntity{

    @Column('text', {nullable: true})
    text: string;

    @ManyToOne(() => CourseEntity, course => course.posts, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'course_id'})
    course: CourseEntity;

}