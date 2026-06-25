import { Test, TestingModule } from '@nestjs/testing';
import { GenericsController } from './generics.controller';
import { GenericsService } from './generics.service';

describe('GenericsController', () => {
  let controller: GenericsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenericsController],
      providers: [GenericsService],
    }).compile();

    controller = module.get<GenericsController>(GenericsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
