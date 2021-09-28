import { CourseEntity } from '../course/course.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../commons/abstract-entity';
import { UserEntity } from '../auth/entities/user.entity';

@Entity('post')
export class PostEntity extends AbstractEntity{

    @Column('text', {nullable: true})
    text: string;

    @ManyToOne(() => UserEntity, user => user.posts, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'user_id'})
    user: UserEntity;

    @ManyToOne(() => CourseEntity, course => course.posts, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'course_id'})
    course: CourseEntity;

}