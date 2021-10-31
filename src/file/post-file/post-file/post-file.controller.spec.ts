import { Test, TestingModule } from '@nestjs/testing';
import { PostFileController } from './post-file.controller';

describe('PostFileController', () => {
  let controller: PostFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostFileController],
    }).compile();

    controller = module.get<PostFileController>(PostFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
