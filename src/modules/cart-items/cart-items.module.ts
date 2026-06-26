import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Cart, ProductVariant])],
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [CartItemsService],
})
export class CartItemsModule {}
