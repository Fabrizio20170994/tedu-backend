import { CourseEntity } from 'src/course/course.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('post')
export class PostEntity {

    @PrimaryGeneratedColumn() 
    id: number;

    @CreateDateColumn() 
    created_at: Date;

    @Column('text', {nullable: true})
    text: string;

    @ManyToOne(() => CourseEntity, course => course.posts, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'course_id'})
    course: CourseEntity;

}