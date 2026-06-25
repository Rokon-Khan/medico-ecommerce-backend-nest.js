import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';

import { Brand } from './entities/brand.entity';
import { CreateBrandDto, BrandResponseDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,

    private readonly dataQueryService: DataQueryService,
  ) {}

  async create(req: Request, createBrandDto: CreateBrandDto): Promise<Brand> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    createBrandDto.name = createBrandDto.name.trim();

    const exists = await this.brandRepo.exists({
      where: {
        name: createBrandDto.name,
      },
    });

    if (exists) {
      throw new BadRequestException('Brand with this name already exists.');
    }

    const brand = this.brandRepo.create({
      ...createBrandDto,
      added_by: String(userId),
    });

    return this.brandRepo.save(brand);
  }

  async findAll(query: any): Promise<IPagination<Brand>> {
    return this.dataQueryService.execute<Brand>({
      repository: this.brandRepo,
      alias: 'brand',
      pagination: query,

      searchableFields: ['name'],

      select: ['id', 'name', 'created_at', 'updated_at'],
    });
  }

  async findOne(id: string): Promise<BrandResponseDto> {
    const brand = await this.brandRepo.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }

    return {
      id: brand.id,
      name: brand.name,

      addedBy: brand.addedBy
        ? {
            id: brand.addedBy.id,
            name: brand.addedBy.name,
          }
        : undefined,

      created_at: brand.created_at,
      updated_at: brand.updated_at,
    };
  }

  async update(id: string, updateDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandRepo.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }

    if (updateDto.name) {
      updateDto.name = updateDto.name.trim();

      const exists = await this.brandRepo.exists({
        where: {
          name: updateDto.name,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException('Brand with this name already exists.');
      }
    }

    Object.assign(brand, updateDto);

    return this.brandRepo.save(brand);
  }

  async remove(id: string): Promise<void> {
    const brand = await this.brandRepo.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }

    const result = await this.brandRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
