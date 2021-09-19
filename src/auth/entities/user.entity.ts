import { classToPlain, Exclude } from "class-transformer";
import * as bcrypt from 'bcryptjs'
import { BeforeInsert, Column, Entity } from "typeorm";
import { AbstractEntity } from "../../commons/abstract-entity";

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