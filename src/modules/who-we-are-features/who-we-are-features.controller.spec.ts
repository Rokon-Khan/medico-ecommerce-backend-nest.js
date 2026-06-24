import { Test, TestingModule } from '@nestjs/testing';
import { WhoWeAreFeaturesController } from './who-we-are-features.controller';
import { WhoWeAreFeaturesService } from './who-we-are-features.service';

describe('WhoWeAreFeaturesController', () => {
  let controller: WhoWeAreFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhoWeAreFeaturesController],
      providers: [WhoWeAreFeaturesService],
    }).compile();

    controller = module.get<WhoWeAreFeaturesController>(WhoWeAreFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
