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

import { Product } from './entities/product.entity';
import { CreateProductDto, ProductResponseDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly dataQueryService: DataQueryService,

    private readonly fileUploadsService: FileUploadsService,
  ) {}

  async create(
    req: Request,
    createDto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    createDto.name = createDto.name.trim();
    createDto.slug = createDto.slug.trim();

    const existingName = await this.productRepo.exists({
      where: {
        name: createDto.name,
      },
    });

    if (existingName) {
      throw new BadRequestException('Product with this name already exists.');
    }

    const existingSlug = await this.productRepo.exists({
      where: {
        slug: createDto.slug,
      },
    });

    if (existingSlug) {
      throw new BadRequestException('Product with this slug already exists.');
    }

    let thumbnail: string | undefined;

    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);

      thumbnail = uploadedFiles[0];
    }

    const product = this.productRepo.create({
      ...createDto,
      thumbnail,
      added_by: String(userId),
    });

    return this.productRepo.save(product);
  }

  // Change IPagination<Product> to IPagination<any> or your custom response interface
  async findAll(query: any): Promise<IPagination<any>> {
    const paginatedResult = await this.dataQueryService.execute<Product>({
      repository: this.productRepo,
      alias: 'product',
      pagination: query,
      searchableFields: ['name', 'slug', 'manufacturer'],
      relations: ['variants', 'category', 'brand'],
    });

    // Typecast or map the inner data safely
    const mappedData = paginatedResult.data.map((product) => {
      const activeVariants = product.variants?.filter((v) => v.is_active) || [];

      const prices = activeVariants.map((v) => Number(v.price));
      const minPrice = prices.length ? Math.min(...prices) : 0;
      const maxPrice = prices.length ? Math.max(...prices) : 0;

      const discountPrices = activeVariants.map((v) =>
        Number(v.discount_price || v.price),
      );
      const minDiscount = discountPrices.length
        ? Math.min(...discountPrices)
        : 0;
      const maxDiscount = discountPrices.length
        ? Math.max(...discountPrices)
        : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail,
        manufacturer: product.manufacturer,
        is_prescription_required: product.is_prescription_required,
        is_active: product.is_active,
        category: product.category
          ? { id: product.category.id, name: product.category.name }
          : null,
        brand: product.brand
          ? { id: product.brand.id, name: product.brand.name }
          : null,
        variants: activeVariants.map((v) => ({
          id: v.id,
          strength: v.strength,
          pack_size: v.pack_size,
          sku: v.sku,
          price: Number(v.price),
          discount_price: v.discount_price ? Number(v.discount_price) : null,
          stock: v.stock,
          weight: v.weight ? Number(v.weight) : null,
          expiry_date: v.expiry_date,
          is_active: v.is_active,
        })),
        price_range: { min: minPrice, max: maxPrice },
        discount_range: { min: minDiscount, max: maxDiscount },
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    });

    // Return a new combined object instead of modifying paginatedResult.data directly
    // if your dataQueryService has strict internal mutations.
    return {
      ...paginatedResult,
      data: mappedData,
    };
  }

  async findOne(id: string): Promise<any> {
    // Or update your ProductResponseDto type definition
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'generic', 'brand', 'addedBy', 'variants'],
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const activeVariants = product.variants?.filter((v) => v.is_active) || [];

    // Calculate price range
    const prices = activeVariants.map((v) => Number(v.price));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    // Calculate discount range
    const discountPrices = activeVariants.map((v) =>
      Number(v.discount_price || v.price),
    );
    const minDiscount = discountPrices.length ? Math.min(...discountPrices) : 0;
    const maxDiscount = discountPrices.length ? Math.max(...discountPrices) : 0;

    return {
      id: product.id,
      category_id: product.category_id,
      generic_id: product.generic_id,
      brand_id: product.brand_id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      manufacturer: product.manufacturer,
      is_active: product.is_active,
      is_prescription_required: product.is_prescription_required,

      meta_title: product.meta_title,
      meta_keywords: product.meta_keywords,
      meta_description: product.meta_description,

      category: product.category
        ? { id: product.category.id, name: product.category.name }
        : undefined,

      generic: product.generic
        ? { id: product.generic.id, name: product.generic.name }
        : undefined,

      brand: product.brand
        ? { id: product.brand.id, name: product.brand.name }
        : undefined,

      variants: activeVariants.map((v) => ({
        id: v.id,
        strength: v.strength,
        pack_size: v.pack_size,
        sku: v.sku,
        price: Number(v.price),
        discount_price: v.discount_price ? Number(v.discount_price) : null,
        stock: v.stock,
        weight: v.weight ? Number(v.weight) : null,
        expiry_date: v.expiry_date,
        is_active: v.is_active,
      })),

      price_range: {
        min: minPrice,
        max: maxPrice,
      },
      discount_range: {
        min: minDiscount,
        max: maxDiscount,
      },

      addedBy: product.addedBy
        ? { id: product.addedBy.id, name: product.addedBy.name }
        : undefined,

      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }

  async update(
    req: Request,
    id: string,
    updateDto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const product = await this.productRepo.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (updateDto.name) {
      updateDto.name = updateDto.name.trim();

      const exists = await this.productRepo.exists({
        where: {
          name: updateDto.name,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException('Product with this name already exists.');
      }
    }

    if (updateDto.slug) {
      updateDto.slug = updateDto.slug.trim();

      const exists = await this.productRepo.exists({
        where: {
          slug: updateDto.slug,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException('Product with this slug already exists.');
      }
    }

    if (file) {
      if (product.thumbnail) {
        const updatedThumbnail =
          await this.fileUploadsService.updateFileUploads({
            oldFile: product.thumbnail,
            currentFile: file,
          });

        updateDto.thumbnail = updatedThumbnail as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);

        updateDto.thumbnail = uploadedFiles[0];
      }
    }

    // Merges properties safely onto the entity tracking proxy instance
    Object.assign(product, updateDto);

    return this.productRepo.save(product);
  }

  async remove(req: Request, id: string): Promise<void> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const product = await this.productRepo.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (product.added_by !== String(userId)) {
      throw new ForbiddenException('You can only delete products you created.');
    }

    if (product.thumbnail) {
      try {
        await this.fileUploadsService.deleteFileUploads(product.thumbnail);
      } catch (error) {
        console.error('Failed to delete thumbnail:', error);
      }
    }

    const result = await this.productRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
