import { Test, TestingModule } from '@nestjs/testing';
import { WhoWeAreFeaturesService } from './who-we-are-features.service';

describe('WhoWeAreFeaturesService', () => {
  let service: WhoWeAreFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhoWeAreFeaturesService],
    }).compile();

    service = module.get<WhoWeAreFeaturesService>(WhoWeAreFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
