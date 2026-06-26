import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not } from 'typeorm';
import { Request } from 'express';
import { Review } from './entities/review.entity';
import { CreateReviewDto, ReviewResponseDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    private readonly dataQueryService: DataQueryService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    req: Request,
    createDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reviewRepo = queryRunner.manager.getRepository(Review);

      const existingReview = await reviewRepo.findOne({
        where: {
          user_id: userId,
          product_id: createDto.product_id,
        },
      });

      if (existingReview) {
        throw new BadRequestException(
          'You have already reviewed this product. You can update your existing review.',
        );
      }

      if (createDto.rating < 1 || createDto.rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5.');
      }

      const review = reviewRepo.create({
        ...createDto,
        user_id: userId,
        is_approved: false,
      });

      const savedReview = await reviewRepo.save(review);

      await queryRunner.commitTransaction();

      return this.getReviewWithRelations(savedReview.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  GET ALL REVIEWS 
 
   */
  async findAll(req: Request, query: any): Promise<IPagination<Review>> {
    const filters: any = {};

    if (query.product_id) {
      filters.product_id = query.product_id;
    }

    if (query.user_id) {
      filters.user_id = query.user_id;
    }

    if (query.rating) {
      filters.rating = parseInt(query.rating, 10);
    }

    if (query.is_approved !== undefined) {
      filters.is_approved = query.is_approved === 'true';
    }

    return this.dataQueryService.execute<Review>({
      repository: this.reviewRepo,
      alias: 'review',
      pagination: query,
      where: filters,
      searchableFields: ['comment', 'user.name', 'user.email'],
      select: ['id', 'rating', 'comment', 'is_approved', 'created_at'],
      relations: ['user', 'product'],
    });
  }

  /**
   *  GET SINGLE REVIEW
   */
  async findOne(req: Request, id: string): Promise<ReviewResponseDto> {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    return this.mapToResponseDto(review);
  }

  /**
   *  GET PRODUCT REVIEWS
   */
  async findProductReviews(
    productId: string,
    query: any,
  ): Promise<IPagination<Review>> {
    const filters: any = {
      product_id: productId,
    };

    if (query.show_all !== 'true') {
      filters.is_approved = true;
    }

    if (query.rating) {
      filters.rating = parseInt(query.rating, 10);
    }

    return this.dataQueryService.execute<Review>({
      repository: this.reviewRepo,
      alias: 'review',
      pagination: query,
      where: filters,
      relations: ['user'],
      select: ['id', 'rating', 'comment', 'is_approved', 'created_at'],
    });
  }

  /**
   *  UPDATE REVIEW
  
   */
  async update(
    req: Request,
    id: string,
    updateDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    //  QueryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reviewRepo = queryRunner.manager.getRepository(Review);

      const review = await reviewRepo.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!review) {
        throw new NotFoundException('Review not found.');
      }

      //  Authorization
      const isAdmin = userRole === 'admin' || userRole === 'super_admin';
      const isOwner = review.user_id === userId;

      if (!isAdmin && !isOwner) {
        throw new ForbiddenException(
          'You can only update your own reviews. Admin can update all reviews.',
        );
      }

      if (updateDto.rating && (updateDto.rating < 1 || updateDto.rating > 5)) {
        throw new BadRequestException('Rating must be between 1 and 5.');
      }

      if (updateDto.rating || updateDto.comment) {
        review.is_approved = false;
      }

      Object.assign(review, updateDto);

      const updatedReview = await reviewRepo.save(review);

      await queryRunner.commitTransaction();

      return this.getReviewWithRelations(updatedReview.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  DELETE REVIEW

   */
  async remove(req: Request, id: string): Promise<{ message: string }> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    //  QueryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reviewRepo = queryRunner.manager.getRepository(Review);

      const review = await reviewRepo.findOne({
        where: { id },
      });

      if (!review) {
        throw new NotFoundException('Review not found.');
      }

      const isAdmin = userRole === 'admin' || userRole === 'super_admin';
      const isOwner = review.user_id === userId;

      if (!isAdmin && !isOwner) {
        throw new ForbiddenException(
          'You can only delete your own reviews. Admin can delete all reviews.',
        );
      }

      const result = await reviewRepo.delete(id);

      if (!result.affected) {
        throw new BadRequestException('Delete failed.');
      }

      await queryRunner.commitTransaction();

      return {
        message: 'Review deleted successfully.',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  APPROVE REVIEW (Admin Only)
   */
  async approveReview(req: Request, id: string): Promise<ReviewResponseDto> {
    const userRole = req?.user?.role;

    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      throw new ForbiddenException('Only admin can approve reviews.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reviewRepo = queryRunner.manager.getRepository(Review);

      const review = await reviewRepo.findOne({
        where: { id },
      });

      if (!review) {
        throw new NotFoundException('Review not found.');
      }

      review.is_approved = true;
      const updatedReview = await reviewRepo.save(review);

      await queryRunner.commitTransaction();

      return this.getReviewWithRelations(updatedReview.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  REJECT REVIEW (Admin Only)
   */
  async rejectReview(req: Request, id: string): Promise<{ message: string }> {
    const userRole = req?.user?.role;

    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      throw new ForbiddenException('Only admin can reject reviews.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reviewRepo = queryRunner.manager.getRepository(Review);

      const review = await reviewRepo.findOne({
        where: { id },
      });

      if (!review) {
        throw new NotFoundException('Review not found.');
      }

      const result = await reviewRepo.delete(id);

      if (!result.affected) {
        throw new BadRequestException('Reject failed.');
      }

      await queryRunner.commitTransaction();

      return {
        message: 'Review rejected and deleted successfully.',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  GET PRODUCT RATING STATS
   */
  async getProductRatingStats(productId: string): Promise<{
    average_rating: number;
    total_reviews: number;
    approved_reviews: number;
    rating_distribution: { [key: number]: number };
  }> {
    const result = await this.reviewRepo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average_rating')
      .addSelect('COUNT(review.id)', 'total_reviews')
      .addSelect(
        'SUM(CASE WHEN review.is_approved = true THEN 1 ELSE 0 END)',
        'approved_reviews',
      )
      .where('review.product_id = :productId', { productId })
      .getRawOne();

    const distribution = await this.reviewRepo
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.product_id = :productId', { productId })
      .andWhere('review.is_approved = true')
      .groupBy('review.rating')
      .getRawMany();

    const ratingDistribution: { [key: number]: number } = {};
    for (let i = 1; i <= 5; i++) {
      const found = distribution.find((d) => parseInt(d.rating) === i);
      ratingDistribution[i] = found ? parseInt(found.count) : 0;
    }

    return {
      average_rating: parseFloat(result.average_rating) || 0,
      total_reviews: parseInt(result.total_reviews) || 0,
      approved_reviews: parseInt(result.approved_reviews) || 0,
      rating_distribution: ratingDistribution,
    };
  }

  private async getReviewWithRelations(id: string): Promise<ReviewResponseDto> {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    return this.mapToResponseDto(review);
  }

  /**
   *  HELPER: Response DTO
   */
  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      user_id: review.user_id,
      product_id: review.product_id,
      rating: review.rating,
      comment: review.comment,
      is_approved: review.is_approved,
      created_at: review.created_at,

      user: review.user
        ? {
            id: review.user.id,
            name: review.user.name,
            email: review.user.email,
          }
        : undefined,

      product: review.product
        ? {
            id: review.product.id,
            name: review.product.name,
            slug: review.product.slug,
          }
        : undefined,
    };
  }
}
