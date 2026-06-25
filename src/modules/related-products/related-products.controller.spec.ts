import { Test, TestingModule } from '@nestjs/testing';
import { RelatedProductsController } from './related-products.controller';
import { RelatedProductsService } from './related-products.service';

describe('RelatedProductsController', () => {
  let controller: RelatedProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelatedProductsController],
      providers: [RelatedProductsService],
    }).compile();

    controller = module.get<RelatedProductsController>(RelatedProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
