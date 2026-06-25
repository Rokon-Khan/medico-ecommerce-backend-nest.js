import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { Generic } from './entities/generic.entity';
import { CreateGenericDto, GenericResponseDto } from './dto/create-generic.dto';
import { UpdateGenericDto } from './dto/update-generic.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { Request } from 'express';

@Injectable()
export class GenericsService {
  constructor(
    @InjectRepository(Generic)
    private readonly genericRepo: Repository<Generic>,

    private readonly dataQueryService: DataQueryService,
  ) {}

  async create(
    req: Request,
    createGenericDto: CreateGenericDto,
  ): Promise<Generic> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }
    createGenericDto.name = createGenericDto.name.trim();

    const exists = await this.genericRepo.exists({
      where: {
        name: createGenericDto.name,
      },
    });

    if (exists) {
      throw new BadRequestException('Generic with this name already exists.');
    }

    const generic = this.genericRepo.create({
      ...createGenericDto,
      added_by: String(userId),
    });

    return this.genericRepo.save(generic);
  }

  async findAll(query: any): Promise<IPagination<Generic>> {
    return this.dataQueryService.execute<Generic>({
      repository: this.genericRepo,
      alias: 'generic',
      pagination: query,

      searchableFields: ['name', 'description'],

      select: ['id', 'name', 'description', 'created_at', 'updated_at'],
    });
  }

  async findOne(id: string): Promise<GenericResponseDto> {
    const generic = await this.genericRepo.findOne({
      where: { id },
    });

    if (!generic) {
      throw new NotFoundException('Generic not found.');
    }

    return {
      id: generic.id,
      name: generic.name,
      description: generic.description,

      addedBy: generic.addedBy
        ? {
            id: generic.addedBy.id,
            name: generic.addedBy.name,
          }
        : undefined,

      created_at: generic.created_at,
      updated_at: generic.updated_at,
    };
  }

  async update(id: string, updateDto: UpdateGenericDto): Promise<Generic> {
    const generic = await this.genericRepo.findOne({
      where: { id },
    });

    if (!generic) {
      throw new NotFoundException('Generic not found.');
    }

    if (updateDto.name) {
      updateDto.name = updateDto.name.trim();

      const exists = await this.genericRepo.exists({
        where: {
          name: updateDto.name,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException('Generic with this name already exists.');
      }
    }

    Object.assign(generic, updateDto);

    return this.genericRepo.save(generic);
  }

  async remove(id: string): Promise<void> {
    const generic = await this.genericRepo.findOne({
      where: { id },
    });

    if (!generic) {
      throw new NotFoundException('Generic not found.');
    }

    const result = await this.genericRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
