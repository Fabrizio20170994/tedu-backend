import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "../auth/entities/user.entity";
import { CourseEntity } from "../course/course.entity";

@Entity('user_course')
export class UserCourseEntity {

    @ManyToOne(() => UserEntity, user => user.userCourses, { primary: true })
    user: UserEntity;

    @ManyToOne(() => CourseEntity, course => course.userCourses, { primary: true })
    course: CourseEntity;

    @Column({default: 0})
    score: number;

}