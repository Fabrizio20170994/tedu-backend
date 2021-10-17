import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../commons/abstract-entity";

@Entity('file')
export class FileEntity extends AbstractEntity{

    @Column('varchar', { length: 255 }) 
    key: string;

}