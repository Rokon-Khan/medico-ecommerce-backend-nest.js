import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../cart-items/entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, CartItem])],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
