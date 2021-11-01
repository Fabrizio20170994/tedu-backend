import { Test, TestingModule } from '@nestjs/testing';
import { CommentFileController } from './comment-file.controller';

describe('FileController', () => {
  let controller: CommentFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentFileController],
    }).compile();

    controller = module.get<CommentFileController>(CommentFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
