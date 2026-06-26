import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, SelectQueryBuilder, Between, In } from 'typeorm';

import { ProductVariant } from '../product-variants/entities/product-variant.entity';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { Product } from '../products/entities/product.entity';
import { ProductSearchDto } from './dto/create-product-search.dto';

@Injectable()
export class ProductSearchService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  /**
   *  Advanced Search with Filters
   */
  async searchProducts(dto: ProductSearchDto): Promise<IPagination<Product>> {
    const {
      search,
      category_id,
      generic_id,
      brand_id,
      manufacturer_id,
      min_price,
      max_price,
      is_prescription_required,
      is_active,
      status,
      sort_by = 'created_at',
      sort_order = 'DESC',
      page = 1,
      limit = 20,
      tags,
      dosage_form,
      strength,
      category_slugs,
    } = dto;

    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.generic', 'generic')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('product.images', 'images')
      .where('1=1');

    //  Search by text
    if (search && search.trim()) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('product.name ILIKE :search')
            .orWhere('product.brand_name ILIKE :search')
            .orWhere('generic.name ILIKE :search')
            .orWhere('manufacturer.name ILIKE :search')
            .orWhere('product.short_description ILIKE :search');
        }),
        { search: `%${search}%` },
      );
    }

    //  Category filter
    if (category_id) {
      queryBuilder.andWhere('product.category_id = :category_id', {
        category_id,
      });
    }

    //  Category slugs filter
    if (category_slugs) {
      const slugs = category_slugs.split(',').map((s) => s.trim());
      queryBuilder.andWhere('category.slug IN (:...slugs)', { slugs });
    }

    //  Generic filter
    if (generic_id) {
      queryBuilder.andWhere('product.generic_id = :generic_id', { generic_id });
    }

    //  Brand filter
    if (brand_id) {
      queryBuilder.andWhere('product.brand_id = :brand_id', { brand_id });
    }

    //  Manufacturer filter
    if (manufacturer_id) {
      queryBuilder.andWhere('product.manufacturer_id = :manufacturer_id', {
        manufacturer_id,
      });
    }

    //  Prescription required filter
    if (is_prescription_required !== undefined) {
      queryBuilder.andWhere(
        'product.is_prescription_required = :is_prescription_required',
        { is_prescription_required },
      );
    }

    //  Active status filter
    if (is_active !== undefined) {
      queryBuilder.andWhere('product.is_active = :is_active', { is_active });
    }

    //  Status filter
    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    }

    //  Dosage form filter
    if (dosage_form) {
      queryBuilder.andWhere('variants.dosage_form = :dosage_form', {
        dosage_form,
      });
    }

    //  Strength filter
    if (strength) {
      queryBuilder.andWhere('variants.strength = :strength', { strength });
    }

    //  Price range filter
    if (min_price !== undefined || max_price !== undefined) {
      const priceSubQuery = this.variantRepo
        .createQueryBuilder('v')
        .select('v.product_id')
        .where('v.price BETWEEN :minPrice AND :maxPrice')
        .andWhere('v.status = :variantStatus');

      if (min_price !== undefined && max_price !== undefined) {
        priceSubQuery.setParameters({
          minPrice: min_price,
          maxPrice: max_price,
          variantStatus: 'active',
        });
      } else if (min_price !== undefined) {
        priceSubQuery
          .where('v.price >= :minPrice')
          .setParameters({ minPrice: min_price, variantStatus: 'active' });
      } else if (max_price !== undefined) {
        priceSubQuery
          .where('v.price <= :maxPrice')
          .setParameters({ maxPrice: max_price, variantStatus: 'active' });
      }

      queryBuilder.andWhere(`product.id IN (${priceSubQuery.getQuery()})`);
    }

    //  Tags filter
    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim());
      queryBuilder.andWhere('product.tags && :tags', { tags: tagList });
    }

    //  Apply sorting
    this.applySorting(queryBuilder, sort_by, sort_order);

    //  Pagination
    const total = await queryBuilder.getCount();
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const data = await queryBuilder.getMany();

    //  Calculate price range for each product
    const productsWithPrice = await this.addPriceRanges(data);

    //  Return with proper IPagination structure
    return {
      data: productsWithPrice,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   *  Apply sorting
   */
  private applySorting(
    qb: SelectQueryBuilder<Product>,
    sort_by: string,
    sort_order: 'ASC' | 'DESC',
  ): void {
    switch (sort_by) {
      case 'name':
        qb.orderBy('product.name', sort_order);
        break;
      case 'price':
        qb.addSelect(
          `(SELECT MIN(v.price) FROM product_variants v WHERE v.product_id = product.id)`,
          'min_price',
        );
        qb.orderBy('min_price', sort_order);
        break;
      case 'rating':
        qb.orderBy('product.rating', sort_order);
        break;
      case 'popularity':
        qb.orderBy('product.view_count', sort_order);
        break;
      case 'created_at':
      default:
        qb.orderBy('product.created_at', sort_order);
        break;
    }
  }

  /**
   *  Add price ranges to products
   */
  private async addPriceRanges(products: Product[]): Promise<Product[]> {
    if (!products.length) return products;

    const productIds = products.map((p) => p.id);

    const priceData = await this.variantRepo
      .createQueryBuilder('variant')
      .select('variant.product_id', 'product_id')
      .addSelect('MIN(variant.price)', 'min_price')
      .addSelect('MAX(variant.price)', 'max_price')
      .where('variant.product_id IN (:...productIds)', { productIds })
      .andWhere('variant.status = :status', { status: 'active' })
      .groupBy('variant.product_id')
      .getRawMany();

    const priceMap = new Map();
    priceData.forEach((item) => {
      priceMap.set(item.product_id, {
        min_price: parseFloat(item.min_price),
        max_price: parseFloat(item.max_price),
      });
    });

    products.forEach((product) => {
      const price = priceMap.get(product.id);
      if (price) {
        (product as any).min_price = price.min_price;
        (product as any).max_price = price.max_price;
      }
    });

    return products;
  }

  /**
   *  Get filter options
   */
  async getFilterOptions(): Promise<{
    categories: { id: string; name: string; count: number }[];
    generics: { id: string; name: string; count: number }[];
    brands: { id: string; name: string; count: number }[];
    manufacturers: { id: string; name: string; count: number }[];
    price_ranges: { label: string; min: number; max: number | null }[];
    dosage_forms: string[];
    strengths: string[];
  }> {
    //  Categories with count
    const categories = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select('category.id', 'id')
      .addSelect('category.name', 'name')
      .addSelect('COUNT(product.id)', 'count')
      .where('product.status = :status', { status: 'active' })
      .groupBy('category.id')
      .orderBy('count', 'DESC')
      .getRawMany();

    //  Generics with count
    const generics = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.generic', 'generic')
      .select('generic.id', 'id')
      .addSelect('generic.name', 'name')
      .addSelect('COUNT(product.id)', 'count')
      .where('product.status = :status', { status: 'active' })
      .groupBy('generic.id')
      .orderBy('count', 'DESC')
      .getRawMany();

    //  Brands with count
    const brands = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.brand', 'brand')
      .select('brand.id', 'id')
      .addSelect('brand.name', 'name')
      .addSelect('COUNT(product.id)', 'count')
      .where('product.status = :status', { status: 'active' })
      .groupBy('brand.id')
      .orderBy('count', 'DESC')
      .getRawMany();

    //  Manufacturers with count
    const manufacturers = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.manufacturer', 'manufacturer')
      .select('manufacturer.id', 'id')
      .addSelect('manufacturer.name', 'name')
      .addSelect('COUNT(product.id)', 'count')
      .where('product.status = :status', { status: 'active' })
      .groupBy('manufacturer.id')
      .orderBy('count', 'DESC')
      .getRawMany();

    //  Price ranges
    const priceRanges = [
      { label: 'Under 100', min: 0, max: 100 },
      { label: '100 - 500', min: 100, max: 500 },
      { label: '500 - 1000', min: 500, max: 1000 },
      { label: '1000 - 2000', min: 1000, max: 2000 },
      { label: 'Above 2000', min: 2000, max: null },
    ];

    //  Dosage forms
    const dosageForms = await this.variantRepo
      .createQueryBuilder('variant')
      .select('DISTINCT variant.dosage_form', 'dosage_form')
      .where('variant.status = :status', { status: 'active' })
      .andWhere('variant.dosage_form IS NOT NULL')
      .orderBy('dosage_form', 'ASC')
      .getRawMany();

    //  Strengths
    const strengths = await this.variantRepo
      .createQueryBuilder('variant')
      .select('DISTINCT variant.strength', 'strength')
      .where('variant.status = :status', { status: 'active' })
      .andWhere('variant.strength IS NOT NULL')
      .orderBy('strength', 'ASC')
      .getRawMany();

    return {
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        count: parseInt(c.count),
      })),
      generics: generics.map((g) => ({
        id: g.id,
        name: g.name,
        count: parseInt(g.count),
      })),
      brands: brands.map((b) => ({
        id: b.id,
        name: b.name,
        count: parseInt(b.count),
      })),
      manufacturers: manufacturers.map((m) => ({
        id: m.id,
        name: m.name,
        count: parseInt(m.count),
      })),
      price_ranges: priceRanges,
      dosage_forms: dosageForms.map((d) => d.dosage_form).filter(Boolean),
      strengths: strengths.map((s) => s.strength).filter(Boolean),
    };
  }

  /**
   *  Autocomplete suggestions
   */
  async autocomplete(
    search: string,
    limit: number = 10,
  ): Promise<{
    products: { id: string; name: string; thumbnail?: string }[];
    generics: { id: string; name: string }[];
    brands: { id: string; name: string }[];
    categories: { id: string; name: string }[];
  }> {
    if (!search || search.length < 2) {
      return { products: [], generics: [], brands: [], categories: [] };
    }

    const searchTerm = `%${search}%`;

    //  Products
    const products = await this.productRepo
      .createQueryBuilder('product')
      .select(['product.id', 'product.name', 'product.thumbnail'])
      .where('product.name ILIKE :search', { search: searchTerm })
      .andWhere('product.status = :status', { status: 'active' })
      .orderBy('product.view_count', 'DESC')
      .limit(limit)
      .getMany();

    //  Generics
    const generics = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.generic', 'generic')
      .select(['generic.id', 'generic.name'])
      .where('generic.name ILIKE :search', { search: searchTerm })
      .andWhere('product.status = :status', { status: 'active' })
      .groupBy('generic.id')
      .limit(limit)
      .getRawMany();

    //  Brands
    const brands = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.brand', 'brand')
      .select(['brand.id', 'brand.name'])
      .where('brand.name ILIKE :search', { search: searchTerm })
      .andWhere('product.status = :status', { status: 'active' })
      .groupBy('brand.id')
      .limit(limit)
      .getRawMany();

    //  Categories
    const categories = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select(['category.id', 'category.name'])
      .where('category.name ILIKE :search', { search: searchTerm })
      .andWhere('product.status = :status', { status: 'active' })
      .groupBy('category.id')
      .limit(limit)
      .getRawMany();

    return {
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        thumbnail: p.thumbnail || undefined,
      })),
      generics: generics.map((g) => ({
        id: g.generic_id,
        name: g.generic_name,
      })),
      brands: brands.map((b) => ({
        id: b.brand_id,
        name: b.brand_name,
      })),
      categories: categories.map((c) => ({
        id: c.category_id,
        name: c.category_name,
      })),
    };
  }

  /**
   *  Get similar products
   */
  async getSimilarProducts(
    productId: string,
    limit: number = 10,
  ): Promise<Product[]> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['category', 'generic'],
    });

    if (!product) {
      return [];
    }

    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.generic', 'generic')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.id != :productId', { productId })
      .andWhere('product.status = :status', { status: 'active' })
      .andWhere('product.is_active = :isActive', { isActive: true });

    //  Find by same category or generic
    queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where('product.category_id = :categoryId', {
          categoryId: product.category_id,
        }).orWhere('product.generic_id = :genericId', {
          genericId: product.generic_id,
        });
      }),
    );

    //  Sort by relevance
    queryBuilder
      .addSelect(
        `CASE 
          WHEN product.category_id = :categoryId AND product.generic_id = :genericId THEN 3
          WHEN product.category_id = :categoryId THEN 2
          WHEN product.generic_id = :genericId THEN 1
          ELSE 0
        END`,
        'relevance',
      )
      .orderBy('relevance', 'DESC')
      .addOrderBy('product.view_count', 'DESC')
      .limit(limit);

    return queryBuilder.getMany();
  }
}
