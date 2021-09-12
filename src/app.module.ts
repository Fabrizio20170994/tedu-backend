import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConnectionService } from './database-connection.service';
import { CursoModule } from './curso/curso.module';
import { APP_FILTER } from '@nestjs/core';
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({useClass: DatabaseConnectionService}), 
    CursoModule],
  controllers: [AppController],
  providers: [
    AppService, 
    {provide: APP_FILTER, useClass: EntityNotFoundExceptionFilter}
  ],
})
export class AppModule {}
