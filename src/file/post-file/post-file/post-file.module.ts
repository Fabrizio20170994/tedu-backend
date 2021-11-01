import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../auth/auth.module';
import { PostEntity } from '../../../post/post.entity';
import { PostFileEntity } from '../post-file.entity';
import { PostFileController } from './post-file.controller';
import { PostFileService } from './post-file.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostFileEntity, PostEntity]), AuthModule],
  providers: [PostFileService],
  controllers: [PostFileController]
})
export class PostFileModule {}
