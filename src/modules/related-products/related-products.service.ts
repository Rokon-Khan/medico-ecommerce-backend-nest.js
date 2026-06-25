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

import { RelatedProduct } from './entities/related-product.entity';
import { Product } from '../products/entities/product.entity';

import {
  CreateRelatedProductDto,
  RelatedProductResponseDto,
} from './dto/create-related-product.dto';
import { UpdateRelatedProductDto } from './dto/update-related-product.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class RelatedProductsService {
  constructor(
    @InjectRepository(RelatedProduct)
    private readonly relatedProductRepo: Repository<RelatedProduct>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly dataQueryService: DataQueryService,
  ) {}

  async create(
    req: Request,
    createDto: CreateRelatedProductDto,
  ): Promise<RelatedProduct> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    if (createDto.product_id === createDto.related_product_id) {
      throw new BadRequestException('Product cannot be related to itself.');
    }

    const product = await this.productRepo.findOne({
      where: { id: createDto.product_id },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const relatedProduct = await this.productRepo.findOne({
      where: { id: createDto.related_product_id },
    });

    if (!relatedProduct) {
      throw new NotFoundException('Related product not found.');
    }

    const exists = await this.relatedProductRepo.exists({
      where: {
        product_id: createDto.product_id,
        related_product_id: createDto.related_product_id,
      },
    });

    if (exists) {
      throw new BadRequestException('Related product already exists.');
    }

    const relation = this.relatedProductRepo.create(createDto);

    return this.relatedProductRepo.save(relation);
  }

  async findAll(query: any): Promise<IPagination<RelatedProduct>> {
    return this.dataQueryService.execute<RelatedProduct>({
      repository: this.relatedProductRepo,
      alias: 'relatedProduct',
      pagination: query,

      select: ['id', 'product_id', 'related_product_id', 'created_at'],
    });
  }

  async findOne(id: string): Promise<RelatedProductResponseDto> {
    const relation = await this.relatedProductRepo.findOne({
      where: { id },
      relations: ['product', 'relatedProduct'],
    });

    if (!relation) {
      throw new NotFoundException('Related product relation not found.');
    }

    return {
      id: relation.id,
      product_id: relation.product_id,
      related_product_id: relation.related_product_id,

      product: relation.product
        ? {
            id: relation.product.id,
            name: relation.product.name,
            slug: relation.product.slug,
          }
        : undefined,

      relatedProduct: relation.relatedProduct
        ? {
            id: relation.relatedProduct.id,
            name: relation.relatedProduct.name,
            slug: relation.relatedProduct.slug,
          }
        : undefined,

      created_at: relation.created_at,
    };
  }

  async update(
    req: Request,
    id: string,
    updateDto: UpdateRelatedProductDto,
  ): Promise<RelatedProduct> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const relation = await this.relatedProductRepo.findOne({
      where: { id },
    });

    if (!relation) {
      throw new NotFoundException('Related product relation not found.');
    }

    if (
      updateDto.product_id &&
      updateDto.related_product_id &&
      updateDto.product_id === updateDto.related_product_id
    ) {
      throw new BadRequestException('Product cannot be related to itself.');
    }

    if (updateDto.product_id || updateDto.related_product_id) {
      const exists = await this.relatedProductRepo.exists({
        where: {
          product_id: updateDto.product_id ?? relation.product_id,
          related_product_id:
            updateDto.related_product_id ?? relation.related_product_id,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException('Related product already exists.');
      }
    }

    Object.assign(relation, updateDto);

    return this.relatedProductRepo.save(relation);
  }

  async remove(req: Request, id: string): Promise<void> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const relation = await this.relatedProductRepo.findOne({
      where: { id },
    });

    if (!relation) {
      throw new NotFoundException('Related product relation not found.');
    }

    const result = await this.relatedProductRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
