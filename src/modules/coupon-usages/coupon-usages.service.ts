import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { CouponUsage } from './entities/coupon-usage.entity';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { CouponUsageResponseDto } from './dto/create-coupon-usage.dto';

@Injectable()
export class CouponUsagesService {
  constructor(
    @InjectRepository(CouponUsage)
    private readonly couponUsageRepo: Repository<CouponUsage>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   *  GET ALL COUPON USAGES (Admin only)

   */
  async findAll(req: Request, query: any): Promise<IPagination<CouponUsage>> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';

    const filters: any = {};

    if (query.coupon_id) {
      filters.coupon_id = query.coupon_id;
    }

    if (query.user_id) {
      if (!isAdmin && query.user_id !== userId) {
        throw new ForbiddenException(
          'You can only view your own coupon usage history.',
        );
      }
      filters.user_id = query.user_id;
    } else if (!isAdmin) {
      filters.user_id = userId;
    }

    if (query.order_id) {
      filters.order_id = query.order_id;
    }

    if (query.from_date) {
      filters.used_at = { $gte: query.from_date };
    }

    if (query.to_date) {
      filters.used_at = { ...filters.used_at, $lte: query.to_date };
    }

    return this.dataQueryService.execute<CouponUsage>({
      repository: this.couponUsageRepo,
      alias: 'usage',
      pagination: query,
      filters,
      relations: ['coupon', 'user', 'order'],
      select: ['id', 'discount_amount', 'order_total', 'metadata', 'used_at'],
    });
  }

  /**
   *  GET SINGLE COUPON USAGE

   */
  async findOne(req: Request, id: string): Promise<CouponUsageResponseDto> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const couponUsage = await this.couponUsageRepo.findOne({
      where: { id },
      relations: ['coupon', 'user', 'order'],
    });

    if (!couponUsage) {
      throw new NotFoundException('Coupon usage not found.');
    }

    //  Authorization check
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isOwner = couponUsage.user_id === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'You can only view your own coupon usage history.',
      );
    }

    return this.mapToResponseDto(couponUsage);
  }

  /**
   *  GET USER COUPON USAGE HISTORY
 
   */
  async getUserHistory(
    req: Request,
    userId: string,
    query: any,
  ): Promise<IPagination<CouponUsage>> {
    const currentUserId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!currentUserId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isOwner = currentUserId === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'You can only view your own coupon usage history.',
      );
    }

    const filters: any = {
      user_id: userId,
    };

    if (query.coupon_id) {
      filters.coupon_id = query.coupon_id;
    }

    if (query.from_date) {
      filters.used_at = { $gte: query.from_date };
    }

    if (query.to_date) {
      filters.used_at = { ...filters.used_at, $lte: query.to_date };
    }

    return this.dataQueryService.execute<CouponUsage>({
      repository: this.couponUsageRepo,
      alias: 'usage',
      pagination: query,
      filters,
      relations: ['coupon', 'order'],
      select: ['id', 'discount_amount', 'order_total', 'used_at'],
    });
  }

  /**
   *  GET COUPON USAGE STATS (Admin only)

   */
  async getCouponUsageStats(
    req: Request,
    couponId: string,
  ): Promise<{
    total_uses: number;
    total_users: number;
    total_discount: number;
    average_discount: number;
    last_7_days: number;
    last_30_days: number;
    daily_usage: { date: string; count: number; total_discount: number }[];
  }> {
    const userRole = req?.user?.role;

    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      throw new ForbiddenException('Only admin can view coupon usage stats.');
    }

    const stats = await this.couponUsageRepo
      .createQueryBuilder('usage')
      .select('COUNT(usage.id)', 'total_uses')
      .addSelect('COUNT(DISTINCT usage.user_id)', 'total_users')
      .addSelect('SUM(usage.discount_amount)', 'total_discount')
      .addSelect('AVG(usage.discount_amount)', 'average_discount')
      .where('usage.coupon_id = :couponId', { couponId })
      .getRawOne();

    const last7Days = await this.couponUsageRepo
      .createQueryBuilder('usage')
      .where('usage.coupon_id = :couponId', { couponId })
      .andWhere('usage.used_at >= NOW() - INTERVAL 7 DAY')
      .getCount();

    const last30Days = await this.couponUsageRepo
      .createQueryBuilder('usage')
      .where('usage.coupon_id = :couponId', { couponId })
      .andWhere('usage.used_at >= NOW() - INTERVAL 30 DAY')
      .getCount();

    const dailyUsage = await this.couponUsageRepo
      .createQueryBuilder('usage')
      .select('DATE(usage.used_at)', 'date')
      .addSelect('COUNT(usage.id)', 'count')
      .addSelect('SUM(usage.discount_amount)', 'total_discount')
      .where('usage.coupon_id = :couponId', { couponId })
      .andWhere('usage.used_at >= NOW() - INTERVAL 30 DAY')
      .groupBy('DATE(usage.used_at)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      total_uses: parseInt(stats.total_uses) || 0,
      total_users: parseInt(stats.total_users) || 0,
      total_discount: parseFloat(stats.total_discount) || 0,
      average_discount: parseFloat(stats.average_discount) || 0,
      last_7_days: last7Days,
      last_30_days: last30Days,
      daily_usage: dailyUsage.map((d) => ({
        date: d.date,
        count: parseInt(d.count) || 0,
        total_discount: parseFloat(d.total_discount) || 0,
      })),
    };
  }

  /**
   *  GET COUPON USAGE BY ORDER

   */
  async getOrderCouponUsage(
    req: Request,
    orderId: string,
  ): Promise<CouponUsageResponseDto | null> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const couponUsage = await this.couponUsageRepo.findOne({
      where: { order_id: orderId },
      relations: ['coupon', 'user', 'order'],
    });

    if (!couponUsage) {
      return null;
    }

    //  Authorization check
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isOwner = couponUsage.user_id === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You can only view your own coupon usage.');
    }

    return this.mapToResponseDto(couponUsage);
  }

  /**
   *  HELPER: Map to Response DTO
   */
  private mapToResponseDto(usage: CouponUsage): CouponUsageResponseDto {
    return {
      id: usage.id,
      coupon_id: usage.coupon_id,
      user_id: usage.user_id,
      order_id: usage.order_id,
      discount_amount: usage.discount_amount,
      order_total: usage.order_total,
      metadata: usage.metadata,
      used_at: usage.used_at,

      coupon: usage.coupon
        ? {
            id: usage.coupon.id,
            code: usage.coupon.code,
            discount_type: usage.coupon.discount_type,
            discount_value: usage.coupon.discount_value,
          }
        : undefined,

      user: usage.user
        ? {
            id: usage.user.id,
            name: usage.user.name ?? '',
            email: usage.user.email,
          }
        : undefined,

      order: usage.order
        ? {
            id: usage.order.id,
            order_number: usage.order.order_number,
            total: usage.order.total_amount,
          }
        : undefined,
    };
  }
}
