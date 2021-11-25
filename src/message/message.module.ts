import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { NotificationEntity } from '../notification/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, UserEntity, NotificationEntity]),
    AuthModule,
  ],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
