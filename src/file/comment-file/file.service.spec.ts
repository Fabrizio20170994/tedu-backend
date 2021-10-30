import { Test, TestingModule } from '@nestjs/testing';
import { CommentFileService } from './comment-file.service';

describe('FileService', () => {
  let service: CommentFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentFileService],
    }).compile();

    service = module.get<CommentFileService>(CommentFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
