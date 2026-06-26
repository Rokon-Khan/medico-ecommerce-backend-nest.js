import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';

import { CartItem } from './entities/cart-item.entity';
import {
  CreateCartItemDto,
  CartItemResponseDto,
} from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,

    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create Cart Item
   */
  async create(req: Request, createDto: CreateCartItemDto): Promise<CartItem> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    /**
     * Prevent duplicate variant in same cart
     */
    const exists = await this.cartItemRepo.exists({
      where: {
        cart_id: createDto.cart_id,
        product_variant_id: createDto.product_variant_id,
      },
    });

    if (exists) {
      throw new BadRequestException(
        'This product variant already exists in the cart.',
      );
    }

    const item = this.cartItemRepo.create(createDto);

    return this.cartItemRepo.save(item);
  }

  /**
   * Get All Cart Items
   */
  async findAll(query: any): Promise<IPagination<CartItem>> {
    return this.dataQueryService.execute<CartItem>({
      repository: this.cartItemRepo,
      alias: 'cartItem',
      pagination: query,

      searchableFields: [],

      select: [
        'id',
        'cart_id',
        'product_variant_id',
        'quantity',
        'price',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   * Get Single Cart Item
   */
  async findOne(id: string): Promise<CartItemResponseDto> {
    const item = await this.cartItemRepo.findOne({
      where: { id },
      relations: ['cart', 'productVariant'],
    });

    if (!item) {
      throw new NotFoundException('Cart item not found.');
    }

    return {
      id: item.id,

      cart_id: item.cart_id,
      product_variant_id: item.product_variant_id,

      quantity: item.quantity,
      price: item.price,

      cart: item.cart
        ? {
            id: item.cart.id,
          }
        : undefined,

      product_variant: item.productVariant
        ? {
            id: item.productVariant.id,
            sku: item.productVariant.sku,
            strength: item.productVariant.strength,
            pack_size: item.productVariant.pack_size,
          }
        : undefined,

      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  }

  /**
   * Update Cart Item
   */
  async update(
    req: Request,
    id: string,
    updateDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const item = await this.cartItemRepo.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found.');
    }

    if (updateDto.cart_id && updateDto.product_variant_id) {
      const exists = await this.cartItemRepo.exists({
        where: {
          cart_id: updateDto.cart_id,
          product_variant_id: updateDto.product_variant_id,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException(
          'This product variant already exists in the cart.',
        );
      }
    }

    Object.assign(item, updateDto);

    return this.cartItemRepo.save(item);
  }

  /**
   * Delete Cart Item
   */
  async remove(req: Request, id: string): Promise<void> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const item = await this.cartItemRepo.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found.');
    }

    const result = await this.cartItemRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
