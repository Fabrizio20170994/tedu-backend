import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('curso')
export class CursoEntity {

    @PrimaryGeneratedColumn() 
    curso_id: number;

    //@CreateDateColumn() fecha_creación

    @Column('int') 
    vacantes: number;

    @Column('varchar', { length: 200, nullable: true })
    descripcion: string;

    @Column('time without time zone')
    fecha_inicio: Date;

    @Column()
    fecha_fin: Date;

}