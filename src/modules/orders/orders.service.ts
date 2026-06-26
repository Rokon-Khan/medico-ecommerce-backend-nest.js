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
      // 1. GET CART
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user_id: String(userId) },
        relations: ['cartItems', 'cartItems.productVariant'],
      });

      if (!cart) throw new NotFoundException('Cart not found');
      if (!cart.cartItems?.length) {
        throw new BadRequestException('Cart is empty');
      }

      // 2. BUILD ORDER ITEMS + SUBTOTAL
      let subtotal = 0;

      const orderItems = cart.cartItems.map((item) => {
        const unitPrice = Number(item.price);
        const quantity = item.quantity;
        const totalPrice = unitPrice * quantity;

        subtotal += totalPrice;

        return {
          product_variant_id: item.product_variant_id,
          product_name:
            `${item.productVariant?.strength ?? ''} ${item.productVariant?.pack_size ?? ''}`.trim(),
          sku: item.productVariant?.sku ?? '',
          quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
        };
      });

      // 3. BUSINESS LOGIC (Daraz style)
      const discount = subtotal >= 5000 ? subtotal * 0.05 : 0;
      const deliveryCharge = subtotal >= 1000 ? 60 : 120;
      const totalAmount = subtotal - discount + deliveryCharge;

      // 4. PAYMENT METHOD (from DTO)
      const paymentMethod = dto.payment_method ?? 'COD';

      let paymentStatus: 'pending' | 'paid' | 'failed' = 'pending';

      if (paymentMethod === 'COD') {
        paymentStatus = 'pending';
      } else if (
        ['BKASH', 'NAGAD', 'SSLCOMMERZ', 'ROCKET'].includes(paymentMethod)
      ) {
        paymentStatus = 'pending'; // gateway pending
      } else {
        throw new BadRequestException('Invalid payment method');
      }

      // 5. CREATE ORDER
      const orderRepo = queryRunner.manager.getRepository(Order);

      const order = orderRepo.create({
        user_id: String(userId),
        address_id: dto.address_id,

        subtotal,
        discount,
        delivery_charge: deliveryCharge,
        total_amount: totalAmount,

        payment_status: paymentStatus,
        order_status: 'pending',

        notes: dto.notes,
        order_number: `ORD-${Date.now()}`,
        placed_at: new Date(),
      });

      const savedOrder = await orderRepo.save(order);

      // 6. CREATE ORDER ITEMS (SNAPSHOT - VERY IMPORTANT)
      const orderItemRepo = queryRunner.manager.getRepository(OrderItem);

      const orderItemEntities = orderItemRepo.create(
        orderItems.map((item) => ({
          ...item,
          order_id: savedOrder.id,
        })),
      );

      await orderItemRepo.save(orderItemEntities);

      // 7. CLEAR CART
      const cartItemRepo = queryRunner.manager.getRepository(CartItem);
      await cartItemRepo.delete({ cart_id: cart.id });

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

    // 1. AUTH CHECK
    if (!user?.sub) {
      throw new UnauthorizedException('Authentication required.');
    }

    // 2. GET ORDER
    const order = await this.orderRepo.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // 3. ROLE CHECK
    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

    const isOwner = order.user_id === String(user.sub);

    // 4. ACCESS CONTROL
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Access denied');
    }

    // 5. RETURN ORDER
    return order;
  }

  /**
   * UPDATE ORDER (ADMIN ONLY USUALLY)
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
      // 1. GET ORDER
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // 2. BLOCK UPDATING DELIVERED ORDERS
      if (order.order_status === 'delivered') {
        throw new BadRequestException('Delivered orders cannot be updated');
      }

      // 3. VALIDATION RULES
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

      // 4. SAFE FIELD UPDATE ONLY
      if (dto.order_status !== undefined) {
        order.order_status = dto.order_status;
      }

      if (dto.payment_status !== undefined) {
        order.payment_status = dto.payment_status;
      }

      if (dto.notes !== undefined) {
        order.notes = dto.notes;
      }

      // 5. SAVE
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
