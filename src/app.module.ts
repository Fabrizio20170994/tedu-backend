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
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserCourseModule } from './user-course/user-course.module';
import { CommentModule } from './comment/comment.module';
import { CommentFileModule } from './file/comment-file/comment-file.module';
import { AttendanceModule } from './attendance/attendance.module';
import { UserAttendanceModule } from './user-attendance/user-attendance.module';
import { MessageModule } from './message/message.module';
import { PostFileModule } from './file/post-file/post-file.module';
import { MessageFileModule } from './file/message-file/message-file.module';
import { NotificationModule } from './notification/notification.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: DatabaseConnectionService }),
    CourseModule,
    PostModule,
    AuthModule,
    UserModule,
    UserCourseModule,
    CommentModule,
    CommentFileModule,
    AttendanceModule,
    UserAttendanceModule,
    PostFileModule,
    MessageModule,
    MessageFileModule,
    NotificationModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: EntityNotFoundErrorFilter },
    { provide: APP_FILTER, useClass: QueryFailedErrorFilter },
  ],
})
export class AppModule {}
