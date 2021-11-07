import { Test, TestingModule } from '@nestjs/testing';
import { MessageFileController } from './message-file.controller';

describe('MessageFileController', () => {
  let controller: MessageFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageFileController],
    }).compile();

    controller = module.get<MessageFileController>(MessageFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
