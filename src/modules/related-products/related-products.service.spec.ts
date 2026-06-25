import { Test, TestingModule } from '@nestjs/testing';
import { RelatedProductsService } from './related-products.service';

describe('RelatedProductsService', () => {
  let service: RelatedProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelatedProductsService],
    }).compile();

    service = module.get<RelatedProductsService>(RelatedProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
