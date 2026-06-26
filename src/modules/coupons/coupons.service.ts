import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  Not,
  Between,
  LessThan,
  MoreThan,
} from 'typeorm';
import { Request } from 'express';

import { Coupon } from './entities/coupon.entity';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { CouponUsage } from '../coupon-usages/entities/coupon-usage.entity';
import { CouponResponseDto, CreateCouponDto } from './dto/create-coupon.dto';
import { ApplyCouponDto, ValidateCouponDto } from './dto/validate-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(CouponUsage)
    private readonly couponUsageRepo: Repository<CouponUsage>,
    private readonly dataQueryService: DataQueryService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * ✅ CREATE COUPON
   */
  async create(
    req: Request,
    createDto: CreateCouponDto,
  ): Promise<CouponResponseDto> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    // ✅ Check unique code
    const existingCoupon = await this.couponRepo.findOne({
      where: { code: createDto.code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new ConflictException('Coupon code already exists.');
    }

    // ✅ Validate dates
    if (createDto.start_date && createDto.end_date) {
      const start = new Date(createDto.start_date);
      const end = new Date(createDto.end_date);

      if (start >= end) {
        throw new BadRequestException('End date must be after start date.');
      }
    }

    // ✅ Validate discount value
    if (
      createDto.discount_type === 'percentage' &&
      createDto.discount_value > 100
    ) {
      throw new BadRequestException('Percentage discount cannot exceed 100%.');
    }

    const coupon = this.couponRepo.create({
      ...createDto,
      code: createDto.code.toUpperCase(),
      added_by: String(userId),
    });

    const savedCoupon = await this.couponRepo.save(coupon);

    return this.mapToResponseDto(savedCoupon);
  }

  /**
   * ✅ GET ALL COUPONS
   */
  async findAll(req: Request, query: any): Promise<IPagination<Coupon>> {
    const filters: any = {};

    if (query.is_active !== undefined) {
      filters.is_active = query.is_active === 'true';
    }

    if (query.discount_type) {
      filters.discount_type = query.discount_type;
    }

    if (query.is_first_order_only !== undefined) {
      filters.is_first_order_only = query.is_first_order_only === 'true';
    }

    return this.dataQueryService.execute<Coupon>({
      repository: this.couponRepo,
      alias: 'coupon',
      pagination: query,
      where: filters,
      searchableFields: ['code', 'description'],
      select: [
        'id',
        'code',
        'discount_type',
        'discount_value',
        'minimum_order_amount',
        'maximum_discount_amount',
        'start_date',
        'end_date',
        'usage_limit',
        'used_count',
        'per_user_limit',
        'is_active',
        'is_first_order_only',
        'is_combinable',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   * ✅ GET ACTIVE COUPONS
   */
  async findActiveCoupons(query: any): Promise<IPagination<Coupon>> {
    const now = new Date();

    const filters: any = {
      is_active: true,
    };

    if (query.is_first_order_only !== undefined) {
      filters.is_first_order_only = query.is_first_order_only === 'true';
    }

    return this.dataQueryService.execute<Coupon>({
      repository: this.couponRepo,
      alias: 'coupon',
      pagination: query,
      filters,
      additionalWhere: `
        (coupon.start_date IS NULL OR coupon.start_date <= :now)
        AND (coupon.end_date IS NULL OR coupon.end_date >= :now)
        AND (coupon.usage_limit IS NULL OR coupon.used_count < coupon.usage_limit)
      `,
      parameters: { now },
      searchableFields: ['code', 'description'],
      select: [
        'id',
        'code',
        'discount_type',
        'discount_value',
        'minimum_order_amount',
        'maximum_discount_amount',
        'usage_limit',
        'used_count',
        'per_user_limit',
        'description',
      ],
    });
  }

  /**
   * ✅ GET SINGLE COUPON
   */
  async findOne(req: Request, id: string): Promise<CouponResponseDto> {
    const coupon = await this.couponRepo.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found.');
    }

    return this.mapToResponseDto(coupon);
  }

  /**
   * ✅ GET COUPON BY CODE
   */
  async findByCode(code: string): Promise<CouponResponseDto> {
    const coupon = await this.couponRepo.findOne({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found.');
    }

    return this.mapToResponseDto(coupon);
  }

  /**
   * ✅ UPDATE COUPON
   */
  async update(
    req: Request,
    id: string,
    updateDto: UpdateCouponDto,
  ): Promise<CouponResponseDto> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const coupon = await this.couponRepo.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found.');
    }

    // ✅ Authorization check
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    if (!isAdmin) {
      throw new ForbiddenException('Only admin can update coupons.');
    }

    // ✅ Check duplicate code
    if (updateDto.code) {
      const existingCoupon = await this.couponRepo.findOne({
        where: {
          code: updateDto.code.toUpperCase(),
          id: Not(id),
        },
      });

      if (existingCoupon) {
        throw new ConflictException('Coupon code already exists.');
      }
      updateDto.code = updateDto.code.toUpperCase();
    }

    // ✅ Validate dates
    const startDate = updateDto.start_date
      ? new Date(updateDto.start_date)
      : coupon.start_date;
    const endDate = updateDto.end_date
      ? new Date(updateDto.end_date)
      : coupon.end_date;

    if (startDate && endDate && startDate >= endDate) {
      throw new BadRequestException('End date must be after start date.');
    }

    // ✅ Validate discount value
    const discountType = updateDto.discount_type || coupon.discount_type;
    const discountValue = updateDto.discount_value || coupon.discount_value;

    if (discountType === 'percentage' && discountValue > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100%.');
    }

    // ✅ Don't allow reducing usage limit below used count
    if (updateDto.usage_limit && updateDto.usage_limit < coupon.used_count) {
      throw new BadRequestException(
        'Usage limit cannot be less than current used count.',
      );
    }

    Object.assign(coupon, updateDto);
    const updatedCoupon = await this.couponRepo.save(coupon);

    return this.mapToResponseDto(updatedCoupon);
  }

  /**
   * ✅ DELETE COUPON
   */
  async remove(req: Request, id: string): Promise<{ message: string }> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const coupon = await this.couponRepo.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found.');
    }

    // ✅ Authorization check
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    if (!isAdmin) {
      throw new ForbiddenException('Only admin can delete coupons.');
    }

    const result = await this.couponRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }

    return {
      message: 'Coupon deleted successfully.',
    };
  }

  /**
   * ✅ VALIDATE COUPON
   */
  async validateCoupon(
    req: Request,
    validateDto: ValidateCouponDto,
  ): Promise<{
    valid: boolean;
    coupon?: CouponResponseDto;
    message?: string;
    discount_amount?: number;
    final_total?: number;
  }> {
    const userId = req?.user?.sub;

    // ✅ Find coupon
    const coupon = await this.couponRepo.findOne({
      where: { code: validateDto.code.toUpperCase() },
    });

    if (!coupon) {
      return {
        valid: false,
        message: 'Invalid coupon code.',
      };
    }

    // ✅ Check active status
    if (!coupon.is_active) {
      return {
        valid: false,
        message: 'This coupon is currently inactive.',
      };
    }

    // ✅ Check date validity
    const now = new Date();
    if (coupon.start_date && now < coupon.start_date) {
      return {
        valid: false,
        message: 'This coupon is not yet active.',
      };
    }

    if (coupon.end_date && now > coupon.end_date) {
      return {
        valid: false,
        message: 'This coupon has expired.',
      };
    }

    // ✅ Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return {
        valid: false,
        message: 'This coupon has reached its usage limit.',
      };
    }

    // ✅ Check per user limit
    if (coupon.per_user_limit && userId) {
      const userUsageCount = await this.couponUsageRepo.count({
        where: {
          coupon_id: coupon.id,
          user_id: userId,
        },
      });

      if (userUsageCount >= coupon.per_user_limit) {
        return {
          valid: false,
          message: 'You have already used this coupon maximum times.',
        };
      }
    }

    // ✅ Check minimum order amount
    if (
      coupon.minimum_order_amount &&
      validateDto.order_total < coupon.minimum_order_amount
    ) {
      return {
        valid: false,
        message: `Minimum order amount of ${coupon.minimum_order_amount} required.`,
      };
    }

    // ✅ Check first order only
    if (coupon.is_first_order_only) {
      if (validateDto.is_first_order === undefined) {
        // Check if user has previous orders
        // This would require checking order history
      }
      if (validateDto.is_first_order === false) {
        return {
          valid: false,
          message: 'This coupon is valid only for first orders.',
        };
      }
    }

    // ✅ Check applicable products
    if (coupon.applicable_products && coupon.applicable_products.length > 0) {
      const hasApplicableProduct = validateDto.product_ids?.some((id) =>
        coupon.applicable_products?.includes(id),
      );
      if (!hasApplicableProduct) {
        return {
          valid: false,
          message: 'This coupon is not applicable to any product in your cart.',
        };
      }
    }

    // ✅ Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (validateDto.order_total * coupon.discount_value) / 100;

      if (coupon.maximum_discount_amount) {
        discountAmount = Math.min(
          discountAmount,
          coupon.maximum_discount_amount,
        );
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    const finalTotal = validateDto.order_total - discountAmount;

    return {
      valid: true,
      coupon: this.mapToResponseDto(coupon),
      discount_amount: discountAmount,
      final_total: finalTotal,
    };
  }

  /**
   * ✅ APPLY COUPON TO ORDER (Transaction)
   */
  async applyCoupon(
    req: Request,
    applyDto: ApplyCouponDto,
  ): Promise<{
    success: boolean;
    message: string;
    coupon_usage?: CouponUsage;
  }> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const couponRepo = queryRunner.manager.getRepository(Coupon);
      const couponUsageRepo = queryRunner.manager.getRepository(CouponUsage);

      // ✅ Find coupon
      const coupon = await couponRepo.findOne({
        where: { code: applyDto.code.toUpperCase() },
      });

      if (!coupon) {
        throw new NotFoundException('Coupon not found.');
      }

      // ✅ Validate coupon (reuse validation logic)
      const validation = await this.validateCoupon(req, {
        code: applyDto.code,
        order_total: applyDto.order_total,
        user_id: userId,
      });

      if (!validation.valid) {
        throw new BadRequestException(validation.message);
      }

      // ✅ Check if already used for this order
      const existingUsage = await couponUsageRepo.findOne({
        where: {
          coupon_id: coupon.id,
          order_id: applyDto.order_id,
        },
      });

      if (existingUsage) {
        throw new ConflictException(
          'This coupon has already been applied to this order.',
        );
      }

      // ✅ Create coupon usage
      const couponUsage = couponUsageRepo.create({
        coupon_id: coupon.id,
        user_id: userId,
        order_id: applyDto.order_id,
        discount_amount: validation.discount_amount || 0,
        order_total: applyDto.order_total,
      });

      const savedUsage = await couponUsageRepo.save(couponUsage);

      // ✅ Increment used count
      coupon.used_count += 1;
      await couponRepo.save(coupon);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Coupon applied successfully.',
        coupon_usage: savedUsage,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * ✅ GET COUPON USAGE STATS
   */
  async getCouponStats(couponId: string): Promise<{
    total_uses: number;
    unique_users: number;
    total_discount_amount: number;
    average_discount: number;
    usage_by_date: any[];
  }> {
    const coupon = await this.couponRepo.findOne({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found.');
    }

    const stats = await this.couponUsageRepo
      .createQueryBuilder('usage')
      .select('COUNT(usage.id)', 'total_uses')
      .addSelect('COUNT(DISTINCT usage.user_id)', 'unique_users')
      .addSelect('SUM(usage.discount_amount)', 'total_discount_amount')
      .addSelect('AVG(usage.discount_amount)', 'average_discount')
      .where('usage.coupon_id = :couponId', { couponId })
      .getRawOne();

    // Usage by date (last 30 days)
    const usageByDate = await this.couponUsageRepo
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
      unique_users: parseInt(stats.unique_users) || 0,
      total_discount_amount: parseFloat(stats.total_discount_amount) || 0,
      average_discount: parseFloat(stats.average_discount) || 0,
      usage_by_date: usageByDate,
    };
  }

  /**
   * ✅ GET USER COUPON HISTORY
   */
  async getUserCouponHistory(
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
        'You can only view your own coupon history.',
      );
    }

    const filters: any = {
      user_id: userId,
    };

    if (query.coupon_id) {
      filters.coupon_id = query.coupon_id;
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
   *  HELPER: Map to Response DTO
   */
  private mapToResponseDto(coupon: Coupon): CouponResponseDto {
    const now = new Date();
    const isExpired = coupon.end_date ? now > coupon.end_date : false;
    const isActive = coupon.is_active && !isExpired;
    const remainingUses = coupon.usage_limit
      ? coupon.usage_limit - coupon.used_count
      : undefined;

    return {
      id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_order_amount: coupon.minimum_order_amount,
      maximum_discount_amount: coupon.maximum_discount_amount,
      start_date: coupon.start_date,
      end_date: coupon.end_date,
      usage_limit: coupon.usage_limit,
      used_count: coupon.used_count,
      per_user_limit: coupon.per_user_limit,
      is_active: coupon.is_active,
      description: coupon.description,
      applicable_products: coupon.applicable_products,
      applicable_categories: coupon.applicable_categories,
      excluded_products: coupon.excluded_products,
      excluded_categories: coupon.excluded_categories,
      is_first_order_only: coupon.is_first_order_only,
      is_combinable: coupon.is_combinable,
      created_at: coupon.created_at,
      updated_at: coupon.updated_at,
      remaining_uses: remainingUses,
      is_expired: isExpired,
      is_valid: isActive && (!coupon.start_date || now >= coupon.start_date),
    };
  }
}
