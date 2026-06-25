import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';

import { ProductDetail } from './entities/product-detail.entity';
import {
  CreateProductDetailDto,
  ProductDetailResponseDto,
} from './dto/create-product-detail.dto';
import { UpdateProductDetailDto } from './dto/update-product-detail.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class ProductDetailsService {
  constructor(
    @InjectRepository(ProductDetail)
    private readonly productDetailRepo: Repository<ProductDetail>,

    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create Product Detail
   */
  async create(
    req: Request,
    createDto: CreateProductDetailDto,
  ): Promise<ProductDetail> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    /**
     * One Product -> One Detail
     */
    const exists = await this.productDetailRepo.exists({
      where: {
        product_id: createDto.product_id,
      },
    });

    if (exists) {
      throw new BadRequestException('This product already has details.');
    }

    const detail = this.productDetailRepo.create({
      ...createDto,
      added_by: String(userId),
    });

    return this.productDetailRepo.save(detail);
  }

  /**
   * Get All Product Details
   */
  async findAll(query: any): Promise<IPagination<ProductDetail>> {
    return this.dataQueryService.execute<ProductDetail>({
      repository: this.productDetailRepo,
      alias: 'productDetail',
      pagination: query,

      searchableFields: ['description', 'indication', 'dosage'],

      select: [
        'id',
        'product_id',
        'description',
        'indication',
        'dosage',
        'side_effects',
        'contraindication',
        'storage',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   * Get Single Product Detail
   */
  async findOne(id: string): Promise<ProductDetailResponseDto> {
    const detail = await this.productDetailRepo.findOne({
      where: { id },
      relations: ['product', 'addedBy'],
    });

    if (!detail) {
      throw new NotFoundException('Product detail not found.');
    }

    return {
      id: detail.id,

      product_id: detail.product_id,

      description: detail.description,
      indication: detail.indication,
      dosage: detail.dosage,
      side_effects: detail.side_effects,
      contraindication: detail.contraindication,
      storage: detail.storage,

      product: detail.product
        ? {
            id: detail.product.id,
            name: detail.product.name,
            slug: detail.product.slug,
          }
        : undefined,

      addedBy: detail.addedBy
        ? {
            id: detail.addedBy.id,
            name: detail.addedBy.name,
          }
        : undefined,

      created_at: detail.created_at,
      updated_at: detail.updated_at,
    };
  }

  /**
   * Update Product Detail
   */
  async update(
    req: Request,
    id: string,
    updateDto: UpdateProductDetailDto,
  ): Promise<ProductDetail> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const detail = await this.productDetailRepo.findOne({
      where: { id },
    });

    if (!detail) {
      throw new NotFoundException('Product detail not found.');
    }

    /**
     * Ownership Check
     */
    if (detail.added_by !== String(userId)) {
      throw new ForbiddenException(
        'You can only update product details you created.',
      );
    }

    /**
     * Prevent duplicate product detail
     */
    if (updateDto.product_id) {
      const exists = await this.productDetailRepo.exists({
        where: {
          product_id: updateDto.product_id,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException('This product already has details.');
      }
    }

    Object.assign(detail, updateDto);

    return this.productDetailRepo.save(detail);
  }

  /**
   * Hard Delete Product Detail
   */
  async remove(req: Request, id: string): Promise<void> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const detail = await this.productDetailRepo.findOne({
      where: { id },
    });

    if (!detail) {
      throw new NotFoundException('Product detail not found.');
    }

    /**
     * Ownership Check
     */
    if (detail.added_by !== String(userId)) {
      throw new ForbiddenException(
        'You can only delete product details you created.',
      );
    }

    const result = await this.productDetailRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
