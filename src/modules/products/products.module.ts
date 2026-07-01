import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from '../product-category/entities/product-category.entity';
import { Generic } from '../generics/entities/generic.entity';
import { Brand } from '../brands/entities/brand.entity';
import { ProductSearchModule } from '../product-search/product-search.module';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, Generic, Brand]),
    ProductSearchModule,
    ProductVariant,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
