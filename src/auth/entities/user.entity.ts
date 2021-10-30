import { classToPlain, Exclude } from "class-transformer";
import * as bcrypt from 'bcryptjs'
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../commons/abstract-entity";
import { UserCourseEntity } from "../../user-course/user-course.entity";
import { CourseEntity } from "../../course/course.entity";
import { PostEntity } from "../../post/post.entity";
import { CommentEntity } from "../../comment/comment.entity";
import { UserAttendanceEntity } from "../../user-attendance/user-attendance.entity";

@Entity('user')
export class UserEntity extends AbstractEntity {

    @Column()
    name: string;

    @Column({nullable: true})
    institution: string;

    @Column({unique: true})
    email: string;

    @Column({nullable: true})
    phone: string;

    @Column()
    @Exclude()
    password: string;

    @OneToMany(() => CourseEntity, course => course.teacher, {nullable: true})
    courses: CourseEntity[];

    @OneToMany(() => PostEntity, post => post.user, {nullable: true})
    posts: PostEntity[];

    @OneToMany(() => UserCourseEntity, userCourse => userCourse.user)
    userCourses: UserCourseEntity[];

    @OneToMany(() => CommentEntity, comment => comment.user)
    comments: CommentEntity[]

    @OneToMany(() => UserAttendanceEntity, userAttendance => userAttendance.user)
    userAttendances: UserAttendanceEntity[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password)
    }

    toJson() {
        return classToPlain(this);
    }
}