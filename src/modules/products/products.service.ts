// // src/modules/products/products.service.ts
// import {
//   Injectable,
//   BadRequestException,
//   NotFoundException,
//   UnauthorizedException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, Not, Like, FindOptionsWhere } from 'typeorm';
// import { Request } from 'express';

// import { Product } from './entities/product.entity';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';

// import { DataQueryService } from 'src/common/data-query/data-query.service';
// import { IPagination } from 'src/common/data-query/pagination.interface';
// import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';
// import { ProductCategory } from '../product-category/entities/product-category.entity';

// @Injectable()
// export class ProductsService {
//   constructor(
//     @InjectRepository(Product)
//     private readonly productRepo: Repository<Product>,

//     @InjectRepository(ProductCategory)
//     private readonly categoryRepo: Repository<ProductCategory>,

//     private readonly dataQueryService: DataQueryService,

//     private readonly fileUploadsService: FileUploadsService,
//   ) {}

//   async create(
//     req: Request,
//     createDto: CreateProductDto,
//     file?: Express.Multer.File,
//   ): Promise<Product> {
//     const userId = req?.user?.sub;

//     if (!userId) {
//       throw new UnauthorizedException('Authentication required.');
//     }

//     createDto.name = createDto.name.trim();
//     createDto.slug = createDto.slug.trim();

//     const existingName = await this.productRepo.exists({
//       where: {
//         name: createDto.name,
//       },
//     });

//     if (existingName) {
//       throw new BadRequestException('Product with this name already exists.');
//     }

//     const existingSlug = await this.productRepo.exists({
//       where: {
//         slug: createDto.slug,
//       },
//     });

//     if (existingSlug) {
//       throw new BadRequestException('Product with this slug already exists.');
//     }

//     let thumbnail: string | undefined;

//     if (file) {
//       const uploadedFiles = await this.fileUploadsService.fileUploads([file]);

//       thumbnail = uploadedFiles[0];
//     }

//     const product = this.productRepo.create({
//       ...createDto,
//       thumbnail,
//       added_by: String(userId),
//     });

//     return this.productRepo.save(product);
//   }

//   // ✅ FIXED: Support category filtering by name or ID
//   // src/modules/products/products.service.ts
//   async findAll(query: any): Promise<IPagination<any>> {
//     const { category, categoryId, categoryName, ...restQuery } = query;

//     let whereClause: any = {};

//     // 1. Category filter by ID (most reliable)
//     if (categoryId) {
//       whereClause = {
//         category: {
//           id: categoryId,
//         },
//       };
//     }
//     // 2. Category filter by slug OR exact name
//     else if (category) {
//       const foundCategory = await this.categoryRepo.findOne({
//         where: [
//           { slug: category }, // Try matching slug first
//           { name: category }, // Fallback to exact name match
//         ],
//       });

//       if (foundCategory) {
//         whereClause = {
//           category: {
//             id: foundCategory.id,
//           },
//         };
//       } else {
//         return this.emptyPaginationResult();
//       }
//     }
//     // 3. Category name with Like partial match
//     else if (categoryName) {
//       const foundCategory = await this.categoryRepo.findOne({
//         where: {
//           name: Like(`%${categoryName}%`),
//         },
//       });

//       if (foundCategory) {
//         whereClause = {
//           category: {
//             id: foundCategory.id,
//           },
//         };
//       } else {
//         return this.emptyPaginationResult();
//       }
//     }

//     const paginatedResult = await this.dataQueryService.execute<Product>({
//       repository: this.productRepo,
//       alias: 'product',
//       pagination: restQuery,
//       searchableFields: ['name', 'slug', 'manufacturer', 'brand.name'],
//       relations: ['variants', 'category', 'brand'],
//       where: whereClause,
//     });

//     return this.mapProductData(paginatedResult);
//   }

//   // Helper to keep code clean and dry
//   private emptyPaginationResult() {
//     return {
//       data: [],
//       meta: {
//         total: 0,
//         page: 1,
//         limit: 100,
//         totalPages: 0,
//       },
//     };
//   }

//   // ✅ Get products by category ID with proper filtering
//   private async findByCategoryId(
//     categoryId: string,
//     query: any,
//   ): Promise<IPagination<any>> {
//     const paginatedResult = await this.dataQueryService.execute<Product>({
//       repository: this.productRepo,
//       alias: 'product',
//       pagination: query,
//       searchableFields: ['name', 'slug', 'manufacturer', 'brand.name'],
//       relations: ['variants', 'category', 'brand'],
//       where: {
//         category: {
//           id: categoryId,
//         },
//       } as any,
//     });

//     return this.mapProductData(paginatedResult);
//   }

//   // ✅ Map product data to response format
//   private mapProductData(
//     paginatedResult: IPagination<Product>,
//   ): IPagination<any> {
//     const mappedData = paginatedResult.data.map((product) => {
//       const activeVariants = product.variants?.filter((v) => v.is_active) || [];

//       const prices = activeVariants.map((v) => Number(v.price));
//       const minPrice = prices.length ? Math.min(...prices) : 0;
//       const maxPrice = prices.length ? Math.max(...prices) : 0;

//       const discountPrices = activeVariants.map((v) =>
//         Number(v.discount_price || v.price),
//       );
//       const minDiscount = discountPrices.length
//         ? Math.min(...discountPrices)
//         : 0;
//       const maxDiscount = discountPrices.length
//         ? Math.max(...discountPrices)
//         : 0;

//       return {
//         id: product.id,
//         name: product.name,
//         slug: product.slug,
//         thumbnail: product.thumbnail,
//         manufacturer: product.manufacturer,
//         is_prescription_required: product.is_prescription_required,
//         is_active: product.is_active,
//         category: product.category
//           ? {
//               id: product.category.id,
//               name: product.category.name,
//               slug: product.category.slug,
//             }
//           : null,
//         brand: product.brand
//           ? { id: product.brand.id, name: product.brand.name }
//           : null,
//         variants: activeVariants.map((v) => ({
//           id: v.id,
//           strength: v.strength,
//           pack_size: v.pack_size,
//           sku: v.sku,
//           price: Number(v.price),
//           discount_price: v.discount_price ? Number(v.discount_price) : null,
//           stock: v.stock,
//           weight: v.weight ? Number(v.weight) : null,
//           expiry_date: v.expiry_date,
//           is_active: v.is_active,
//         })),
//         price_range: { min: minPrice, max: maxPrice },
//         discount_range: { min: minDiscount, max: maxDiscount },
//         created_at: product.created_at,
//         updated_at: product.updated_at,
//       };
//     });

//     return {
//       ...paginatedResult,
//       data: mappedData,
//     };
//   }

//   // ✅ Get products by category ID (public method)
//   async findByCategory(
//     categoryId: string,
//     query: any,
//   ): Promise<IPagination<any>> {
//     return this.findByCategoryId(categoryId, query);
//   }

//   // ✅ Get products by category name (public method)
//   async findByCategoryName(
//     categoryName: string,
//     query: any,
//   ): Promise<IPagination<any>> {
//     const foundCategory = await this.categoryRepo.findOne({
//       where: {
//         name: Like(`%${categoryName}%`),
//       },
//     });

//     if (!foundCategory) {
//       return {
//         data: [],
//         meta: {
//           total: 0,
//           page: 1,
//           limit: 100,
//           totalPages: 0,
//         },
//       };
//     }

//     return this.findByCategoryId(foundCategory.id, query);
//   }

//   async findOne(id: string): Promise<any> {
//     const product = await this.productRepo.findOne({
//       where: { id },
//       relations: ['category', 'generic', 'brand', 'addedBy', 'variants'],
//     });

//     if (!product) {
//       throw new NotFoundException('Product not found.');
//     }

//     const activeVariants = product.variants?.filter((v) => v.is_active) || [];

//     const prices = activeVariants.map((v) => Number(v.price));
//     const minPrice = prices.length ? Math.min(...prices) : 0;
//     const maxPrice = prices.length ? Math.max(...prices) : 0;

//     const discountPrices = activeVariants.map((v) =>
//       Number(v.discount_price || v.price),
//     );
//     const minDiscount = discountPrices.length ? Math.min(...discountPrices) : 0;
//     const maxDiscount = discountPrices.length ? Math.max(...discountPrices) : 0;

//     return {
//       id: product.id,
//       category_id: product.category_id,
//       generic_id: product.generic_id,
//       brand_id: product.brand_id,
//       name: product.name,
//       slug: product.slug,
//       thumbnail: product.thumbnail,
//       manufacturer: product.manufacturer,
//       is_active: product.is_active,
//       is_prescription_required: product.is_prescription_required,
//       meta_title: product.meta_title,
//       meta_keywords: product.meta_keywords,
//       meta_description: product.meta_description,
//       category: product.category
//         ? {
//             id: product.category.id,
//             name: product.category.name,
//             slug: product.category.slug,
//           }
//         : undefined,
//       generic: product.generic
//         ? { id: product.generic.id, name: product.generic.name }
//         : undefined,
//       brand: product.brand
//         ? { id: product.brand.id, name: product.brand.name }
//         : undefined,
//       variants: activeVariants.map((v) => ({
//         id: v.id,
//         strength: v.strength,
//         pack_size: v.pack_size,
//         sku: v.sku,
//         price: Number(v.price),
//         discount_price: v.discount_price ? Number(v.discount_price) : null,
//         stock: v.stock,
//         weight: v.weight ? Number(v.weight) : null,
//         expiry_date: v.expiry_date,
//         is_active: v.is_active,
//       })),
//       price_range: {
//         min: minPrice,
//         max: maxPrice,
//       },
//       discount_range: {
//         min: minDiscount,
//         max: maxDiscount,
//       },
//       addedBy: product.addedBy
//         ? { id: product.addedBy.id, name: product.addedBy.name }
//         : undefined,
//       created_at: product.created_at,
//       updated_at: product.updated_at,
//     };
//   }

//   async update(
//     req: Request,
//     id: string,
//     updateDto: UpdateProductDto,
//     file?: Express.Multer.File,
//   ): Promise<Product> {
//     const userId = req?.user?.sub;

//     if (!userId) {
//       throw new UnauthorizedException('Authentication required.');
//     }

//     const product = await this.productRepo.findOne({
//       where: { id },
//     });

//     if (!product) {
//       throw new NotFoundException('Product not found.');
//     }

//     if (updateDto.name) {
//       updateDto.name = updateDto.name.trim();

//       const exists = await this.productRepo.exists({
//         where: {
//           name: updateDto.name,
//           id: Not(id),
//         },
//       });

//       if (exists) {
//         throw new BadRequestException('Product with this name already exists.');
//       }
//     }

//     if (updateDto.slug) {
//       updateDto.slug = updateDto.slug.trim();

//       const exists = await this.productRepo.exists({
//         where: {
//           slug: updateDto.slug,
//           id: Not(id),
//         },
//       });

//       if (exists) {
//         throw new BadRequestException('Product with this slug already exists.');
//       }
//     }

//     if (file) {
//       if (product.thumbnail) {
//         const updatedThumbnail =
//           await this.fileUploadsService.updateFileUploads({
//             oldFile: product.thumbnail,
//             currentFile: file,
//           });

//         updateDto.thumbnail = updatedThumbnail as string;
//       } else {
//         const uploadedFiles = await this.fileUploadsService.fileUploads([file]);

//         updateDto.thumbnail = uploadedFiles[0];
//       }
//     }

//     Object.assign(product, updateDto);

//     return this.productRepo.save(product);
//   }

//   async remove(req: Request, id: string): Promise<void> {
//     const userId = req?.user?.sub;

//     if (!userId) {
//       throw new UnauthorizedException('Authentication required.');
//     }

//     const product = await this.productRepo.findOne({
//       where: { id },
//     });

//     if (!product) {
//       throw new NotFoundException('Product not found.');
//     }

//     if (product.added_by !== String(userId)) {
//       throw new ForbiddenException('You can only delete products you created.');
//     }

//     if (product.thumbnail) {
//       try {
//         await this.fileUploadsService.deleteFileUploads(product.thumbnail);
//       } catch (error) {
//         console.error('Failed to delete thumbnail:', error);
//       }
//     }

//     const result = await this.productRepo.delete(id);

//     if (!result.affected) {
//       throw new BadRequestException('Delete failed.');
//     }
//   }
// }

// src/modules/products/products.service.ts

// src/modules/products/products.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';
import { Request } from 'express';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';
import { ProductCategory } from '../product-category/entities/product-category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductCategory)
    private readonly categoryRepo: Repository<ProductCategory>,

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

  // ✅ FIXED: Support category filtering by name or ID
  async findAll(query: any): Promise<IPagination<any>> {
    const { category, categoryId, categoryName, ...restQuery } = query;

    console.log('🔍 Received query params:', {
      category,
      categoryId,
      categoryName,
    });

    let whereClause: any = {};

    // 1. Category filter by ID (most reliable)
    if (categoryId) {
      console.log('✅ Filtering by category ID:', categoryId);
      whereClause = {
        category: {
          id: categoryId,
        },
      };
    }
    // 2. Category filter by slug OR exact name
    else if (category) {
      console.log('🔍 Looking for category by slug/name:', category);
      const foundCategory = await this.categoryRepo.findOne({
        where: [
          { slug: category }, // Try matching slug first
          { name: category }, // Fallback to exact name match
        ],
      });

      if (foundCategory) {
        console.log('✅ Found category:', foundCategory.name, foundCategory.id);
        whereClause = {
          category: {
            id: foundCategory.id,
          },
        };
      } else {
        console.log('❌ Category not found:', category);
        return this.emptyPaginationResult();
      }
    }
    // 3. Category name with Like partial match
    else if (categoryName) {
      console.log('🔍 Looking for category by name like:', categoryName);
      const foundCategory = await this.categoryRepo.findOne({
        where: {
          name: Like(`%${categoryName}%`),
        },
      });

      if (foundCategory) {
        console.log('✅ Found category:', foundCategory.name, foundCategory.id);
        whereClause = {
          category: {
            id: foundCategory.id,
          },
        };
      } else {
        console.log('❌ Category not found:', categoryName);
        return this.emptyPaginationResult();
      }
    }

    console.log('📦 Final whereClause:', JSON.stringify(whereClause, null, 2));

    const paginatedResult = await this.dataQueryService.execute<Product>({
      repository: this.productRepo,
      alias: 'product',
      pagination: restQuery,
      searchableFields: ['name', 'slug', 'manufacturer', 'brand.name'],
      relations: ['variants', 'category', 'brand'],
      where: whereClause,
    });

    console.log('📊 Products found:', paginatedResult.data.length);

    return this.mapProductData(paginatedResult);
  }

  // Helper to keep code clean and dry
  private emptyPaginationResult(): IPagination<any> {
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 100,
        totalPages: 0,
      },
    };
  }

  // ✅ Get products by category ID with proper filtering using QueryBuilder
  async findByCategory(
    categoryId: string,
    query: any,
  ): Promise<IPagination<any>> {
    console.log('🔍 findByCategory called with ID:', categoryId);

    // Direct query using TypeORM QueryBuilder for reliability
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('category.id = :categoryId', { categoryId });

    // Apply pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    // Apply search if provided
    if (query.search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.slug LIKE :search OR product.manufacturer LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Apply sorting if provided
    if (query.sortBy) {
      switch (query.sortBy) {
        case 'price-low':
          queryBuilder.orderBy('product.price', 'ASC');
          break;
        case 'price-high':
          queryBuilder.orderBy('product.price', 'DESC');
          break;
        case 'name':
          queryBuilder.orderBy('product.name', 'ASC');
          break;
        default:
          queryBuilder.orderBy('product.created_at', 'DESC');
      }
    } else {
      queryBuilder.orderBy('product.created_at', 'DESC');
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    console.log(`📊 Found ${data.length} products for category ${categoryId}`);

    // Manual pagination result
    const paginatedResult: IPagination<Product> = {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return this.mapProductData(paginatedResult);
  }

  // ✅ Get products by category name
  async findByCategoryName(
    categoryName: string,
    query: any,
  ): Promise<IPagination<any>> {
    console.log('🔍 findByCategoryName called with name:', categoryName);

    // Find the category by name (case insensitive)
    const foundCategory = await this.categoryRepo.findOne({
      where: {
        name: Like(`%${categoryName}%`),
      },
    });

    if (!foundCategory) {
      console.log('❌ Category not found with name:', categoryName);
      return this.emptyPaginationResult();
    }

    console.log('✅ Found category:', foundCategory.name, foundCategory.id);

    // Use the existing findByCategory method with the found ID
    return this.findByCategory(foundCategory.id, query);
  }

  // ✅ Map product data to response format
  private mapProductData(
    paginatedResult: IPagination<Product>,
  ): IPagination<any> {
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
          ? {
              id: product.category.id,
              name: product.category.name,
              slug: product.category.slug,
            }
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

    return {
      ...paginatedResult,
      data: mappedData,
    };
  }

  async findOne(id: string): Promise<any> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'generic', 'brand', 'addedBy', 'variants'],
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const activeVariants = product.variants?.filter((v) => v.is_active) || [];

    const prices = activeVariants.map((v) => Number(v.price));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

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
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
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
