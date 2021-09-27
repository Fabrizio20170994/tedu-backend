import { classToPlain, Exclude } from "class-transformer";
import * as bcrypt from 'bcryptjs'
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../commons/abstract-entity";
import { UserCourseEntity } from "../../user-course/user-course.entity";
import { CourseEntity } from "../../course/course.entity";

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

    @OneToMany(() => UserCourseEntity, userCourse => userCourse.user)
    userCourses: UserCourseEntity[];

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