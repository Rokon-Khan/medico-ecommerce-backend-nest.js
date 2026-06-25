import { Test, TestingModule } from '@nestjs/testing';
import { GenericsService } from './generics.service';

describe('GenericsService', () => {
  let service: GenericsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenericsService],
    }).compile();

    service = module.get<GenericsService>(GenericsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
