import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { cursoDTO } from './curso.dto';
import { CursoEntity } from './curso.entity';

@Injectable()
export class CursoService {

    constructor(
        @InjectRepository(CursoEntity) 
        private cursoRepository: Repository<CursoEntity>
    ) {}

    async obtenerCursos(): Promise<CursoEntity[]>{
        return await this.cursoRepository.find();
    }

    async crearCurso(data: Partial<cursoDTO>): Promise<CursoEntity>{
        const curso = this.cursoRepository.create(data);
        await this.cursoRepository.save(curso);
        return curso;
    }

    async obtenerCurso(curso_id: number): Promise<CursoEntity>{
        //return await this.cursoRepository.findOne({where: {curso_id: curso_id} });
        return await this.cursoRepository.findOneOrFail({curso_id});
    }
    
    async actualizarCurso(curso_id: number, data: Partial<cursoDTO>): Promise<CursoEntity>{
        await this.cursoRepository.update({curso_id}, data);
        return await this.cursoRepository.findOne({curso_id});
    }

    async eliminarCurso(curso_id: number): Promise<{ deleted: boolean; }>{
        await this.cursoRepository.delete(curso_id);
        return { deleted: true }
    }

}
