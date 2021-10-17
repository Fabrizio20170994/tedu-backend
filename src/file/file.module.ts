import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FileEntity } from './file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), AuthModule],
  providers: [FileService],
  controllers: [FileController]
})
export class FileModule {}
