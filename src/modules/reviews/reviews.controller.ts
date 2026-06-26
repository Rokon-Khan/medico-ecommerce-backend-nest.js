import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

@Controller('reviews')
@UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * ✅ CREATE REVIEW
   */
  @RequirePermissions(Permission.REVIEW_CREATE)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req, dto);
  }

  /**
   * ✅ GET ALL REVIEWS
   */
  @RequirePermissions(Permission.REVIEW_READ)
  @Get()
  findAll(@Req() req: Request, @Query() query: any) {
    return this.reviewsService.findAll(req, query);
  }

  /**
   * ✅ GET PRODUCT REVIEWS
   */
  @RequirePermissions(Permission.REVIEW_READ)
  @Get('product/:productId')
  findProductReviews(
    @Req() req: Request,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query() query: any,
  ) {
    return this.reviewsService.findProductReviews(productId, query);
  }

  /**
   * ✅ GET PRODUCT RATING STATS (পাবলিক এন্ডপয়েন্ট)
   */
  @Get('product/:productId/stats')
  getProductStats(
    @Req() req: Request,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.reviewsService.getProductRatingStats(productId);
  }

  /**
   * ✅ GET SINGLE REVIEW
   */
  @RequirePermissions(Permission.REVIEW_READ)
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findOne(req, id);
  }

  /**
   * ✅ UPDATE REVIEW
   */
  @RequirePermissions(Permission.REVIEW_UPDATE)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(req, id, dto);
  }

  /**
   * ✅ DELETE REVIEW
   */
  @RequirePermissions(Permission.REVIEW_DELETE)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.remove(req, id);
  }

  /**
   * ✅ APPROVE REVIEW (Admin Only)
   */
  @RequirePermissions(Permission.REVIEW_APPROVE)
  @Patch(':id/approve')
  approveReview(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.approveReview(req, id);
  }

  /**
   * ✅ REJECT REVIEW (Admin Only)
   */
  @RequirePermissions(Permission.REVIEW_REJECT)
  @Delete(':id/reject')
  rejectReview(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.rejectReview(req, id);
  }
}
