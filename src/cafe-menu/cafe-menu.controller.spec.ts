import { Test, TestingModule } from '@nestjs/testing';
import { CafeMenuController } from './cafe-menu.controller';

describe('CafeMenuController', () => {
  let controller: CafeMenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CafeMenuController],
    }).compile();

    controller = module.get<CafeMenuController>(CafeMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
