import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { cursoDTO } from './curso.dto';
import { CursoService } from './curso.service';

@Controller('cursos')
export class CursoController {

    constructor(private cursoService: CursoService) {}

    @Get()
    async obtenerCursos(){
        return this.cursoService.obtenerCursos();
    }

    @Post()
    async crearCurso(@Body() data: Partial<cursoDTO>){
        return this.cursoService.crearCurso(data);
    }

    @Get(':curso_id')
    async obtenerCurso(@Param('curso_id') curso_id: number){
        return this.cursoService.obtenerCurso(curso_id);
    }

    @Put(':curso_id')
    async actualizarCurso(@Param('curso_id') curso_id: number, @Body() data: Partial<cursoDTO>){
        return this.cursoService.actualizarCurso(curso_id, data);
    }

    @Delete(':curso_id')
    async eliminarCurso(@Param('curso_id') curso_id: number){
        return this.cursoService.eliminarCurso(curso_id);
    }

}
