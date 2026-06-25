import { Module } from '@nestjs/common';
import { RelatedProductsService } from './related-products.service';
import { RelatedProductsController } from './related-products.controller';

@Module({
  controllers: [RelatedProductsController],
  providers: [RelatedProductsService],
})
export class RelatedProductsModule {}
