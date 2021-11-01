import { Test, TestingModule } from '@nestjs/testing';
import { PostFileService } from './post-file.service';

describe('PostFileService', () => {
  let service: PostFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostFileService],
    }).compile();

    service = module.get<PostFileService>(PostFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
