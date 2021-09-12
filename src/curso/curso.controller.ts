import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { cursoDTO } from './curso.dto';
import { CursoService } from './curso.service';

@Controller('cursos')
export class CursoController {

    constructor(private cursoService: CursoService) {}

    @Get()
    obtenerCursos(){
        return this.cursoService.obtenerCursos();
    }

    @Post()
    crearCurso(@Body() data: Partial<cursoDTO>){
        return this.cursoService.crearCurso(data);
    }

    @Get(':curso_id')
    obtenerCurso(@Param('curso_id') curso_id: number){
        return this.cursoService.obtenerCurso(curso_id);
    }

    @Put(':curso_id')
    actualizarCurso(@Param('curso_id') curso_id: number, @Body() data: Partial<cursoDTO>){
        return this.cursoService.actualizarCurso(curso_id, data);
    }

    @Delete(':curso_id')
    eliminarCurso(@Param('curso_id') curso_id: number){
        return this.cursoService.eliminarCurso(curso_id);
    }

}
