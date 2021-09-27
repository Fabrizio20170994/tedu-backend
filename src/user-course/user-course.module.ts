import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCourseController } from './user-course.controller';
import { UserCourseEntity } from './user-course.entity';
import { UserCourseService } from './user-course.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserCourseEntity])],
  controllers: [UserCourseController],
  providers: [UserCourseService]
})
export class UserCourseModule {}
