import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoController } from './curso.controller';
import { CursoEntity } from './curso.entity';
import { CursoService } from './curso.service';

@Module({
  imports: [TypeOrmModule.forFeature([CursoEntity])],
  controllers: [CursoController],
  providers: [CursoService]
})
export class CursoModule {}
