import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConnectionService } from './database-connection.service';
import { CourseModule } from './course/course.module';
import { APP_FILTER } from '@nestjs/core';
import { EntityNotFoundErrorFilter } from './filters/entity-not-found-error.filter';
import { PostModule } from './post/post.module';
import { QueryFailedErrorFilter } from './filters/query-failed-error.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({useClass: DatabaseConnectionService}), 
    CourseModule, PostModule],
  controllers: [AppController],
  providers: [
    AppService, 
    {provide: APP_FILTER, useClass: EntityNotFoundErrorFilter},
    {provide: APP_FILTER, useClass: QueryFailedErrorFilter}
  ],
})
export class AppModule {}
