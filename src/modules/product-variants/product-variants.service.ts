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

import { ProductVariant } from './entities/product-variant.entity';
import {
  CreateProductVariantDto,
  ProductVariantResponseDto,
} from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepo: Repository<ProductVariant>,

    private readonly dataQueryService: DataQueryService,
  ) {}

  async create(
    req: Request,
    createDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    createDto.sku = createDto.sku.trim();

    const skuExists = await this.productVariantRepo.exists({
      where: {
        sku: createDto.sku,
      },
    });

    if (skuExists) {
      throw new BadRequestException(
        'Product variant with this SKU already exists.',
      );
    }

    const variant = this.productVariantRepo.create({
      ...createDto,
      added_by: String(userId),
    });

    return this.productVariantRepo.save(variant);
  }

  async findAll(query: any): Promise<IPagination<ProductVariant>> {
    return this.dataQueryService.execute<ProductVariant>({
      repository: this.productVariantRepo,
      alias: 'variant',
      pagination: query,

      searchableFields: ['sku', 'strength', 'pack_size'],

      select: [
        'id',
        'product_id',
        'strength',
        'pack_size',
        'sku',
        'price',
        'discount_price',
        'stock',
        'weight',
        'expiry_date',
        'is_active',
        'created_at',
        'updated_at',
      ],
    });
  }

  async findOne(id: string): Promise<ProductVariantResponseDto> {
    const variant = await this.productVariantRepo.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found.');
    }

    return {
      id: variant.id,
      product_id: variant.product_id,

      strength: variant.strength,
      pack_size: variant.pack_size,
      sku: variant.sku,

      price: variant.price,
      discount_price: variant.discount_price,
      stock: variant.stock,
      weight: variant.weight,

      expiry_date: variant.expiry_date,
      is_active: variant.is_active,

      product: variant.product
        ? {
            id: variant.product.id,
            name: variant.product.name,
            slug: variant.product.slug,
          }
        : undefined,

      addedBy: variant.addedBy
        ? {
            id: variant.addedBy.id,
            name: variant.addedBy.name,
          }
        : undefined,

      created_at: variant.created_at,
      updated_at: variant.updated_at,
    };
  }

  async update(
    req: Request,
    id: string,
    updateDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const variant = await this.productVariantRepo.findOne({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found.');
    }

    if (updateDto.sku) {
      updateDto.sku = updateDto.sku.trim();

      const exists = await this.productVariantRepo.exists({
        where: {
          sku: updateDto.sku,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException(
          'Product variant with this SKU already exists.',
        );
      }
    }

    Object.assign(variant, updateDto);

    return this.productVariantRepo.save(variant);
  }

  async remove(req: Request, id: string): Promise<void> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const variant = await this.productVariantRepo.findOne({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found.');
    }

    if (variant.added_by !== String(userId)) {
      throw new ForbiddenException(
        'You can only delete product variants you created.',
      );
    }

    const result = await this.productVariantRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
