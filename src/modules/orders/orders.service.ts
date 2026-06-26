import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { Order } from './entities/order.entity';
import { Cart } from 'src/modules/carts/entities/cart.entity';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Role } from 'src/auth/enums/role-type.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  /**
   * CREATE ORDER (Checkout)
   */
  async create(req: Request, dto: CreateOrderDto) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Login required');
    }

    // 1. Get cart with items
    const cart = await this.cartRepo.findOne({
      where: { user_id: String(userId) },
      relations: ['cartItems', 'cartItems.productVariant'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 2. CALCULATE PRICING (backend only)
    let subtotal = 0;

    for (const item of cart.cartItems) {
      const price = Number(item.price);
      const quantity = item.quantity;

      subtotal += price * quantity;
    }

    // 3. DISCOUNT LOGIC (example)
    let discount = 0;

    if (subtotal > 5000) {
      discount = subtotal * 0.05; // 5% discount
    }

    // 4. DELIVERY CHARGE LOGIC
    const deliveryCharge = subtotal > 1000 ? 60 : 120;

    // 5. TOTAL
    const totalAmount = subtotal - discount + deliveryCharge;

    // 6. CREATE ORDER NUMBER
    const orderNumber = `ORD-${Date.now()}`;

    // 7. CREATE ORDER
    const order = this.orderRepo.create({
      user_id: String(userId),
      address_id: dto.address_id,

      subtotal,
      discount,
      delivery_charge: deliveryCharge,
      total_amount: totalAmount,

      payment_status: 'pending',
      order_status: 'pending',
      notes: dto.notes,
      order_number: orderNumber,

      placed_at: new Date(),
    });

    const savedOrder = await this.orderRepo.save(order);

    // 8. CLEAR CART AFTER ORDER
    await this.cartItemRepo.delete({ cart_id: cart.id });

    return savedOrder;
  }

  /**
   * GET ALL ORDERS (ADMIN vs USER)
   */
  async findAll(req: Request, query: any) {
    const user = req.user;

    if (!user) {
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

    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }

    const order = await this.orderRepo.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // user can only access own order
    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

    const isOwner = order.user_id === String(user.sub);

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Access denied');
    }
    {
      throw new UnauthorizedException('Access denied');
    }

    return order;
  }

  /**
   * UPDATE ORDER (ADMIN ONLY USUALLY)
   */
  async update(req: Request, id: string, dto: UpdateOrderDto) {
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    Object.assign(order, dto);

    return this.orderRepo.save(order);
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
