import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from './entities/order-item.entity';
import { GetOrderItemDto } from './dto/get-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  /**
   * GET ALL ORDER ITEMS (ADMIN ONLY)
   */
  async findAll(query: GetOrderItemDto) {
    const qb = this.orderItemRepo.createQueryBuilder('orderItem');

    if (query.order_id) {
      qb.andWhere('orderItem.order_id = :order_id', {
        order_id: query.order_id,
      });
    }

    if (query.product_variant_id) {
      qb.andWhere('orderItem.product_variant_id = :product_variant_id', {
        product_variant_id: query.product_variant_id,
      });
    }

    if (query.sku) {
      qb.andWhere('orderItem.sku ILIKE :sku', {
        sku: `%${query.sku}%`,
      });
    }

    const data = await qb.orderBy('orderItem.created_at', 'DESC').getMany();

    return data;
  }

  /**
   * GET SINGLE ORDER ITEM
   */
  async findOne(id: string) {
    const item = await this.orderItemRepo.findOne({
      where: { id },
      relations: ['order', 'productVariant'],
    });

    if (!item) {
      throw new NotFoundException('Order item not found');
    }

    return item;
  }
}
