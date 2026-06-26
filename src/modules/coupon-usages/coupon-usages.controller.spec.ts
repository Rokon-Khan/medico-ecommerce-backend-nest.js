import { Test, TestingModule } from '@nestjs/testing';
import { CouponUsagesController } from './coupon-usages.controller';
import { CouponUsagesService } from './coupon-usages.service';

describe('CouponUsagesController', () => {
  let controller: CouponUsagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponUsagesController],
      providers: [CouponUsagesService],
    }).compile();

    controller = module.get<CouponUsagesController>(CouponUsagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
