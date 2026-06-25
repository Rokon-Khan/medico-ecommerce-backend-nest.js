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
import {
  CreateProductCategoryDto,
  ProductCategoryResponseDto,
} from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategory } from './entities/product-category.entity';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepo: Repository<ProductCategory>,

    private readonly fileUploadsService: FileUploadsService,

    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create Product Category
   */
  async create(
    req: Request,
    createDto: CreateProductCategoryDto,
    file?: Express.Multer.File,
  ): Promise<ProductCategory> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    createDto.name = createDto.name.trim();

    const exists = await this.categoryRepo.exists({
      where: {
        name: createDto.name,
      },
    });

    if (exists) {
      throw new BadRequestException(
        'Product category with this name already exists.',
      );
    }

    let imageUrl: string | undefined;

    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);

      imageUrl = uploadedFiles[0];
    }

    const category = this.categoryRepo.create({
      ...createDto,
      image: imageUrl,
      added_by: String(userId),
    });

    return this.categoryRepo.save(category);
  }

  /**
   * Get All Categories
   */
  async findAll(query: any): Promise<IPagination<ProductCategory>> {
    return this.dataQueryService.execute<ProductCategory>({
      repository: this.categoryRepo,
      alias: 'category',
      pagination: query,

      searchableFields: ['name'],

      select: ['id', 'name', 'image', 'created_at', 'updated_at'],
    });
  }

  /**
   * Get Single Category
   */
  async findOne(id: string): Promise<ProductCategoryResponseDto> {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Product category not found.');
    }

    return {
      id: category.id,
      name: category.name,
      image: category.image,
      addedBy: category.addedBy
        ? {
            id: category.addedBy.id,
            name: category.addedBy.name,
          }
        : undefined,

      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }

  /**
   * Update Category
   */
  async update(
    req: Request,
    id: string,
    updateDto: UpdateProductCategoryDto,
    file?: Express.Multer.File,
  ): Promise<ProductCategory> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const category = await this.categoryRepo.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Product category not found.');
    }

    /**
     * Ownership Check
     */
    if (category.added_by !== String(userId)) {
      throw new ForbiddenException(
        'You can only update categories you created.',
      );
    }

    /**
     * Duplicate Name Validation
     */
    if (updateDto.name) {
      updateDto.name = updateDto.name.trim();

      const exists = await this.categoryRepo.exists({
        where: {
          name: updateDto.name,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException(
          'Product category with this name already exists.',
        );
      }
    }

    /**
     * Image Update
     */
    if (file) {
      if (category.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: category.image,
          currentFile: file,
        });

        updateDto.image = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);

        updateDto.image = uploadedFiles[0];
      }
    }

    Object.assign(category, updateDto);

    return this.categoryRepo.save(category);
  }

  /**
   * Hard Delete Category
   */
  async remove(req: Request, id: string): Promise<void> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const category = await this.categoryRepo.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Product category not found.');
    }

    /**
     * Ownership Check
     */
    if (category.added_by !== String(userId)) {
      throw new ForbiddenException(
        'You can only delete categories you created.',
      );
    }

    /**
     * Delete Image
     */
    if (category.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(category.image);
      } catch (error) {
        console.error('Failed to delete category image:', error);
      }
    }

    /**
     * Hard Delete
     */
    const result = await this.categoryRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
