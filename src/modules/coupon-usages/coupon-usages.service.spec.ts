import { Test, TestingModule } from '@nestjs/testing';
import { CouponUsagesService } from './coupon-usages.service';

describe('CouponUsagesService', () => {
  let service: CouponUsagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponUsagesService],
    }).compile();

    service = module.get<CouponUsagesService>(CouponUsagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
