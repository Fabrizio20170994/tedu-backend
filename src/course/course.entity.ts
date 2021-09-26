import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';

@Entity('course')
export class CourseEntity {

    @PrimaryGeneratedColumn() 
    id: number;

    @Column()
    @Generated("uuid")
    code: string;

    @Column('int') 
    vacancies: number;

    @Column('varchar', { length: 180 })
    name: string;

    @Column('varchar', { length: 200, nullable: true })
    desc: string;

    @Column('timestamp without time zone')
    start_date: Date;

    @Column('timestamp without time zone')
    end_date: Date;

    @OneToMany(() => PostEntity, post => post.course, {nullable: true})
    posts: PostEntity[];

    @OneToMany(() => UserCourseEntity, userCourse => userCourse.course)
    userCourses: UserCourseEntity[];

}