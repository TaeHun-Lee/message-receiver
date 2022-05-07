import { Test, TestingModule } from '@nestjs/testing';
import { CafeMenuService } from './cafe-menu.service';

describe('CafeMenuService', () => {
  let service: CafeMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CafeMenuService],
    }).compile();

    service = module.get<CafeMenuService>(CafeMenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
