import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, In } from 'typeorm';
import { Request } from 'express';

import { Order } from 'src/modules/orders/entities/order.entity';
import {
  OrderTracking,
  OrderStatusEnum,
} from './entities/order-tracking.entity';

import { OrderTrackingDetailResponseDto } from './dto/order-tracking-response.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';
import {
  BulkUpdateOrderStatusDto,
  OrderTrackingFilterDto,
  UpdateOrderStatusDto,
} from './dto/update-order-tracking.dto';

@Injectable()
export class OrderTrackingService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderTracking)
    private readonly trackingRepo: Repository<OrderTracking>,
    private readonly dataQueryService: DataQueryService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * ✅ Update Order Status (Single)
   */
  async updateStatus(
    req: Request,
    orderId: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderTrackingDetailResponseDto> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isManager = userRole === 'manager';

    if (!isAdmin && !isManager) {
      throw new ForbiddenException(
        'Only admin/manager can update order status.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderRepo = queryRunner.manager.getRepository(Order);
      const trackingRepo = queryRunner.manager.getRepository(OrderTracking);

      // ✅ Find order with lock
      const order = await orderRepo.findOne({
        where: { id: orderId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!order) {
        throw new NotFoundException('Order not found.');
      }

      // ✅ Validate status transition
      this.validateStatusTransition(order.order_status, dto.status);

      // ✅ Update order status
      const oldStatus = order.order_status;
      order.order_status = dto.status;

      // Update timestamps based on status
      this.updateOrderTimestamps(order, dto.status);

      await orderRepo.save(order);

      // ✅ Create tracking entry
      const tracking = trackingRepo.create({
        order_id: order.id,
        status: dto.status,
        note: dto.note || this.getStatusNote(dto.status),
        metadata: {
          ...dto.metadata,
          old_status: oldStatus,
          changed_by: userId,
          changed_at: new Date().toISOString(),
        },
        changed_by: userId,
      });

      await trackingRepo.save(tracking);

      await queryRunner.commitTransaction();

      return this.getOrderTrackingDetail(orderId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * ✅ Bulk Update Order Status
   */
  async bulkUpdateStatus(
    req: Request,
    dto: BulkUpdateOrderStatusDto,
  ): Promise<{
    success: boolean;
    updated_count: number;
    failed_ids: string[];
  }> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    if (!isAdmin) {
      throw new ForbiddenException('Only admin can bulk update orders.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderRepo = queryRunner.manager.getRepository(Order);
      const trackingRepo = queryRunner.manager.getRepository(OrderTracking);

      const failedIds: string[] = [];
      let updatedCount = 0;

      // ✅ Process in batches for performance
      const batchSize = 50;
      for (let i = 0; i < dto.order_ids.length; i += batchSize) {
        const batch = dto.order_ids.slice(i, i + batchSize);

        const orders = await orderRepo.find({
          where: { id: In(batch) },
          lock: { mode: 'pessimistic_write' },
        });

        for (const order of orders) {
          try {
            this.validateStatusTransition(order.order_status, dto.status);
            order.order_status = dto.status;
            this.updateOrderTimestamps(order, dto.status);
            await orderRepo.save(order);

            const tracking = trackingRepo.create({
              order_id: order.id,
              status: dto.status,
              note: dto.note || this.getStatusNote(dto.status),
              metadata: {
                bulk_update: true,
                changed_by: userId,
                changed_at: new Date().toISOString(),
              },
              changed_by: userId,
            });
            await trackingRepo.save(tracking);

            updatedCount++;
          } catch (error) {
            failedIds.push(order.id);
          }
        }
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        updated_count: updatedCount,
        failed_ids: failedIds,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * ✅ Get Order Tracking Detail
   */
  async getOrderTrackingDetail(
    orderId: string,
  ): Promise<OrderTrackingDetailResponseDto> {
    // ✅ Find order
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    // ✅ Get tracking history
    const trackingHistory = await this.trackingRepo.find({
      where: { order_id: orderId },
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: 50,
    });

    // ✅ Calculate progress
    const statusFlow = this.getStatusFlow(
      order.order_status as OrderStatusEnum,
    );
    const progress = this.calculateProgress(
      order.order_status as OrderStatusEnum,
    );

    return {
      order_id: order.id,
      order_number: order.order_number,
      current_status: order.order_status as OrderStatusEnum,
      order_date: order.created_at,
      placed_at: order.placed_at,
      confirmed_at: this.getStatusTimestamp(order, OrderStatusEnum.CONFIRMED),
      processed_at: this.getStatusTimestamp(order, OrderStatusEnum.PROCESSING),
      shipped_at: this.getStatusTimestamp(order, OrderStatusEnum.SHIPPED),
      delivered_at: this.getStatusTimestamp(order, OrderStatusEnum.DELIVERED),
      cancelled_at: this.getStatusTimestamp(order, OrderStatusEnum.CANCELLED),
      estimated_delivery: this.calculateEstimatedDelivery(
        order.order_status as OrderStatusEnum,
      ),
      tracking_history: trackingHistory.map((t) => ({
        id: t.id,
        order_id: t.order_id,
        status: t.status as OrderStatusEnum,
        note: t.note,
        metadata: t.metadata,
        created_at: t.created_at,
        user: t.user
          ? {
              id: t.user.id,
              name: t.user.name,
            }
          : undefined,
      })),
      total_updates: trackingHistory.length,
      last_update:
        trackingHistory.length > 0
          ? trackingHistory[0].created_at
          : order.created_at,
      progress_percentage: progress,
      status_flow: statusFlow,
    };
  }

  /**
   * ✅ Get Order Tracking History with Pagination
   */
  async getTrackingHistory(
    req: Request,
    filter: OrderTrackingFilterDto,
  ): Promise<IPagination<OrderTracking>> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isManager = userRole === 'manager';

    const filters: any = {};

    if (filter.order_id) {
      filters.order_id = filter.order_id;

      if (!isAdmin && !isManager) {
        const order = await this.orderRepo.findOne({
          where: { id: filter.order_id },
          select: ['user_id'],
        });
        if (order && order.user_id !== userId) {
          throw new ForbiddenException('You can only view your own orders.');
        }
      }
    }

    if (filter.status) {
      filters.status = filter.status;
    }

    if (filter.from_date && filter.to_date) {
      filters.created_at = Between(
        new Date(filter.from_date),
        new Date(filter.to_date),
      );
    }

    return this.dataQueryService.execute<OrderTracking>({
      repository: this.trackingRepo,
      alias: 'tracking',
      pagination: {
        page: filter.page || 1,
        limit: filter.limit || 10,
        search: filter.search || '',
        sort_by: 'created_at',
        sort_order: 'DESC',
      },
      filters,
      relations: ['order', 'user'],
      filterableFields: ['order_id', 'status'],
      searchableFields: ['note', 'order.order_number'],
    });
  }

  /**
   * ✅ Get Order Status Timeline
   */
  async getOrderTimeline(orderId: string): Promise<
    {
      status: OrderStatusEnum;
      timestamp: Date;
      note?: string;
      metadata?: any;
    }[]
  > {
    const tracking = await this.trackingRepo.find({
      where: { order_id: orderId },
      order: { created_at: 'ASC' },
      select: ['status', 'created_at', 'note', 'metadata'],
    });

    return tracking.map((t) => ({
      status: t.status as OrderStatusEnum,
      timestamp: t.created_at,
      note: t.note,
      metadata: t.metadata,
    }));
  }

  /**
   * ✅ Get Order Status Statistics (Admin only)
   */
  async getStatusStats(req: Request): Promise<{
    total_orders: number;
    status_breakdown: { status: string; count: number; percentage: number }[];
    today_orders: number;
    pending_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    average_delivery_time_hours: number;
  }> {
    const userRole = req?.user?.role;

    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      throw new ForbiddenException('Only admin can view status stats.');
    }

    const totalOrders = await this.orderRepo.count();

    const statusBreakdown = await this.orderRepo
      .createQueryBuilder('order')
      .select('order.order_status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.order_status')
      .getRawMany();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await this.orderRepo.count({
      where: { created_at: Between(today, new Date()) },
    });

    const pendingOrders = await this.orderRepo.count({
      where: { order_status: OrderStatusEnum.PENDING },
    });

    const deliveredOrders = await this.orderRepo.count({
      where: { order_status: OrderStatusEnum.DELIVERED },
    });

    const cancelledOrders = await this.orderRepo.count({
      where: { order_status: OrderStatusEnum.CANCELLED },
    });

    const avgDeliveryTime = await this.orderRepo
      .createQueryBuilder('order')
      .select(
        'AVG(EXTRACT(EPOCH FROM (order.delivered_at - order.placed_at))/3600)',
        'avg_hours',
      )
      .where('order.order_status = :status', {
        status: OrderStatusEnum.DELIVERED,
      })
      .getRawOne();

    return {
      total_orders: totalOrders,
      status_breakdown: statusBreakdown.map((item) => ({
        status: item.status,
        count: parseInt(item.count),
        percentage:
          totalOrders > 0 ? (parseInt(item.count) / totalOrders) * 100 : 0,
      })),
      today_orders: todayOrders,
      pending_orders: pendingOrders,
      delivered_orders: deliveredOrders,
      cancelled_orders: cancelledOrders,
      average_delivery_time_hours: parseFloat(avgDeliveryTime?.avg_hours) || 0,
    };
  }

  /**
   * ✅ Get status timestamp from order
   */
  private getStatusTimestamp(
    order: Order,
    status: OrderStatusEnum,
  ): Date | undefined {
    const timestamps: Record<OrderStatusEnum, keyof Order> = {
      [OrderStatusEnum.PENDING]: 'created_at',
      [OrderStatusEnum.CONFIRMED]: 'confirmed_at' as any,
      [OrderStatusEnum.PROCESSING]: 'processed_at' as any,
      [OrderStatusEnum.SHIPPED]: 'shipped_at' as any,
      [OrderStatusEnum.OUT_FOR_DELIVERY]: 'shipped_at' as any,
      [OrderStatusEnum.DELIVERED]: 'delivered_at' as any,
      [OrderStatusEnum.CANCELLED]: 'cancelled_at' as any,
      [OrderStatusEnum.RETURNED]: 'updated_at' as any,
      [OrderStatusEnum.REFUNDED]: 'updated_at' as any,
    };

    const field = timestamps[status];
    if (field && order[field]) {
      return order[field] as Date;
    }
    return undefined;
  }

  /**
   * ✅ Validate Status Transition
   */
  private validateStatusTransition(
    current: string,
    newStatus: OrderStatusEnum,
  ): void {
    const validTransitions: Record<string, OrderStatusEnum[]> = {
      [OrderStatusEnum.PENDING]: [
        OrderStatusEnum.CONFIRMED,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.CONFIRMED]: [
        OrderStatusEnum.PROCESSING,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.PROCESSING]: [
        OrderStatusEnum.SHIPPED,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.SHIPPED]: [
        OrderStatusEnum.OUT_FOR_DELIVERY,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.OUT_FOR_DELIVERY]: [
        OrderStatusEnum.DELIVERED,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.DELIVERED]: [
        OrderStatusEnum.RETURNED,
        OrderStatusEnum.REFUNDED,
      ],
      [OrderStatusEnum.CANCELLED]: [],
      [OrderStatusEnum.RETURNED]: [OrderStatusEnum.REFUNDED],
      [OrderStatusEnum.REFUNDED]: [],
    };

    const allowed = validTransitions[current];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${current} to ${newStatus}`,
      );
    }
  }

  /**
   * ✅ Update Order Timestamps
   */
  private updateOrderTimestamps(order: Order, status: OrderStatusEnum): void {
    const now = new Date();
    switch (status) {
      case OrderStatusEnum.PENDING:
        order.placed_at = now;
        break;
      case OrderStatusEnum.CONFIRMED:
        (order as any).confirmed_at = now;
        break;
      case OrderStatusEnum.PROCESSING:
        (order as any).processed_at = now;
        break;
      case OrderStatusEnum.SHIPPED:
        (order as any).shipped_at = now;
        break;
      case OrderStatusEnum.DELIVERED:
        (order as any).delivered_at = now;
        break;
      case OrderStatusEnum.CANCELLED:
        (order as any).cancelled_at = now;
        break;
    }
  }

  /**
   * ✅ Get Status Note
   */
  private getStatusNote(status: OrderStatusEnum): string {
    const notes: Record<OrderStatusEnum, string> = {
      [OrderStatusEnum.PENDING]: 'Order placed successfully',
      [OrderStatusEnum.CONFIRMED]: 'Order confirmed by admin',
      [OrderStatusEnum.PROCESSING]: 'Order is being processed',
      [OrderStatusEnum.SHIPPED]: 'Order has been shipped',
      [OrderStatusEnum.OUT_FOR_DELIVERY]: 'Order is out for delivery',
      [OrderStatusEnum.DELIVERED]: 'Order delivered successfully',
      [OrderStatusEnum.CANCELLED]: 'Order has been cancelled',
      [OrderStatusEnum.RETURNED]: 'Order has been returned',
      [OrderStatusEnum.REFUNDED]: 'Order has been refunded',
    };
    return notes[status] || `Status updated to ${status}`;
  }

  /**
   * ✅ Get Status Flow
   */
  private getStatusFlow(currentStatus: OrderStatusEnum): {
    current_step: number;
    total_steps: number;
    steps: {
      status: OrderStatusEnum;
      label: string;
      completed: boolean;
      timestamp?: Date;
    }[];
  } {
    const flow = [
      { status: OrderStatusEnum.PENDING, label: 'Order Placed' },
      { status: OrderStatusEnum.CONFIRMED, label: 'Confirmed' },
      { status: OrderStatusEnum.PROCESSING, label: 'Processing' },
      { status: OrderStatusEnum.SHIPPED, label: 'Shipped' },
      { status: OrderStatusEnum.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
      { status: OrderStatusEnum.DELIVERED, label: 'Delivered' },
    ];

    const currentIndex = flow.findIndex((f) => f.status === currentStatus);
    const isCompleted = (status: OrderStatusEnum) => {
      const idx = flow.findIndex((f) => f.status === status);
      return idx <= currentIndex;
    };

    return {
      current_step: currentIndex + 1,
      total_steps: flow.length,
      steps: flow.map((f) => ({
        status: f.status,
        label: f.label,
        completed: isCompleted(f.status),
      })),
    };
  }

  /**
   * ✅ Calculate Progress
   */
  private calculateProgress(status: OrderStatusEnum): number {
    const flow = [
      OrderStatusEnum.PENDING,
      OrderStatusEnum.CONFIRMED,
      OrderStatusEnum.PROCESSING,
      OrderStatusEnum.SHIPPED,
      OrderStatusEnum.OUT_FOR_DELIVERY,
      OrderStatusEnum.DELIVERED,
    ];

    const index = flow.indexOf(status);
    if (index === -1) return 0;
    return Math.round(((index + 1) / flow.length) * 100);
  }

  /**
   * ✅ Calculate Estimated Delivery
   */
  private calculateEstimatedDelivery(
    status: OrderStatusEnum,
  ): Date | undefined {
    if (status === OrderStatusEnum.DELIVERED) return undefined;
    if (status === OrderStatusEnum.CANCELLED) return undefined;

    const now = new Date();
    const estimated = new Date(now);
    estimated.setDate(estimated.getDate() + 3);
    return estimated;
  }
}
