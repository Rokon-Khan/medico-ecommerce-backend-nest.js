import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { Cart } from 'src/modules/carts/entities/cart.entity';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Address } from 'src/modules/address/entities/address.entity';
import { Role } from 'src/auth/enums/role-type.enum';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  async create(req: Request, dto: CreateOrderDto) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Login required');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. GET OR CREATE ADDRESS
      let address = await queryRunner.manager.findOne(Address, {
        where: { user_id: String(userId), is_default: true },
      });

      // If no default address exists, create one from the shipping address in DTO
      if (!address) {
        if (!dto.shipping_address) {
          throw new BadRequestException('Please provide a shipping address');
        }

        const addressRepo = queryRunner.manager.getRepository(Address);

        const newAddress = new Address();
        newAddress.user_id = String(userId);
        newAddress.address = dto.shipping_address.address_line;
        newAddress.is_default = true;
        newAddress.phone = dto.shipping_address.phone || '';
        newAddress.email = dto.shipping_address.email || '';

        address = await addressRepo.save(newAddress);
      }

      // 2. VALIDATE ORDER ITEMS FROM DTO
      if (!dto.items || dto.items.length === 0) {
        throw new BadRequestException('Order must have at least one item');
      }

      // 3. CALCULATE SUBTOTAL
      let subtotal = 0;
      const orderItemsData = dto.items.map((item) => {
        const unitPrice = Number(item.unit_price);
        const quantity = item.quantity;
        const totalPrice = unitPrice * quantity;
        subtotal += totalPrice;

        return {
          product_variant_id: item.product_variant_id,
          product_name: item.product_name,
          sku: item.sku,
          quantity: quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
        };
      });

      // 4. BUSINESS LOGIC (Daraz style)
      const discount = subtotal >= 5000 ? subtotal * 0.05 : 0;
      const deliveryCharge = subtotal >= 1000 ? 60 : 120;
      const totalAmount = subtotal - discount + deliveryCharge;

      // 5. PAYMENT METHOD
      const paymentMethod = dto.payment_method ?? 'COD';

      let paymentStatus: 'pending' | 'paid' | 'failed' = 'pending';

      if (paymentMethod === 'COD') {
        paymentStatus = 'pending';
      } else if (
        ['BKASH', 'NAGAD', 'SSLCOMMERZ', 'ROCKET'].includes(paymentMethod)
      ) {
        paymentStatus = 'pending';
      } else {
        throw new BadRequestException('Invalid payment method');
      }

      // 6. CREATE ORDER
      const orderRepo = queryRunner.manager.getRepository(Order);

      const newOrder = new Order();
      newOrder.user_id = String(userId);
      newOrder.address_id = address.id;
      newOrder.subtotal = subtotal;
      newOrder.discount = discount;
      newOrder.delivery_charge = deliveryCharge;
      newOrder.total_amount = totalAmount;
      newOrder.payment_status = paymentStatus;
      newOrder.payment_method = paymentMethod;
      newOrder.order_status = 'pending';
      newOrder.notes = dto.notes || '';
      newOrder.order_number = `ORD-${Date.now()}`;
      newOrder.placed_at = new Date();

      const savedOrder = await orderRepo.save(newOrder);

      // 7. CREATE ORDER ITEMS
      const orderItemRepo = queryRunner.manager.getRepository(OrderItem);

      const orderItemEntities = orderItemsData.map((item) => {
        const orderItem = new OrderItem();
        orderItem.order_id = savedOrder.id;
        orderItem.product_variant_id = item.product_variant_id;
        orderItem.product_name = item.product_name;
        orderItem.sku = item.sku;
        orderItem.quantity = item.quantity;
        orderItem.unit_price = item.unit_price;
        orderItem.total_price = item.total_price;
        return orderItem;
      });

      await orderItemRepo.save(orderItemEntities);

      // 8. COMMIT TRANSACTION
      await queryRunner.commitTransaction();

      return {
        order: savedOrder,
        items: orderItemEntities,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * GET ALL ORDERS (ADMIN vs USER)
   */
  async findAll(req: Request, query: any) {
    const user = req.user;

    if (!user?.sub) {
      throw new UnauthorizedException('Authentication required.');
    }
    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

    if (isAdmin) {
      return this.orderRepo.find({
        order: { created_at: 'DESC' },
      });
    }

    return this.orderRepo.find({
      where: { user_id: String(user.sub) },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * GET SINGLE ORDER (SECURE)
   */
  async findOne(req: Request, id: string) {
    const user = req?.user;

    if (!user?.sub) {
      throw new UnauthorizedException('Authentication required.');
    }

    const order = await this.orderRepo.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;
    const isOwner = order.user_id === String(user.sub);

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  /**
   * UPDATE ORDER (ADMIN ONLY)
   */
  async update(req: Request, id: string, dto: UpdateOrderDto) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

    if (!isAdmin) {
      throw new ForbiddenException('Only admin can update orders');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.order_status === 'delivered') {
        throw new BadRequestException('Delivered orders cannot be updated');
      }

      const allowedOrderStatus = [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ];

      const allowedPaymentStatus = ['pending', 'paid', 'failed'];

      if (dto.order_status && !allowedOrderStatus.includes(dto.order_status)) {
        throw new BadRequestException('Invalid order status');
      }

      if (
        dto.payment_status &&
        !allowedPaymentStatus.includes(dto.payment_status)
      ) {
        throw new BadRequestException('Invalid payment status');
      }

      if (dto.order_status !== undefined) {
        order.order_status = dto.order_status;
      }

      if (dto.payment_status !== undefined) {
        order.payment_status = dto.payment_status;
      }

      if (dto.notes !== undefined) {
        order.notes = dto.notes;
      }

      const updatedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();

      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * DELETE ORDER
   */
  async remove(req: Request, id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderRepo.delete(id);

    return { message: 'Order deleted successfully' };
  }
}
