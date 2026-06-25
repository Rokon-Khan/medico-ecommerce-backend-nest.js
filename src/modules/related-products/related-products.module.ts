import { Module } from '@nestjs/common';
import { RelatedProductsService } from './related-products.service';
import { RelatedProductsController } from './related-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatedProduct } from './entities/related-product.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RelatedProduct, Product])],
  controllers: [RelatedProductsController],
  providers: [RelatedProductsService],
  exports: [RelatedProductsService],
})
export class RelatedProductsModule {}
