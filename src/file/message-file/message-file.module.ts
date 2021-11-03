import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { MessageEntity } from '../../message/message.entity';
import { MessageFileController } from './message-file.controller';
import { MessageFileEntity } from './message-file.entity';
import { MessageFileService } from './message-file.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageFileEntity, MessageEntity]), AuthModule],
  providers: [MessageFileService],
  controllers: [MessageFileController]
})
export class MessageFileModule {}
