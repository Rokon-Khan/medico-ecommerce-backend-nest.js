import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';
import { WhoWeAreFeature } from './entities/who-we-are-feature.entity';
import {
  CreateWhoWeAreFeatureDto,
  WhoWeAreFeatureResponseDto,
} from './dto/create-who-we-are-feature.dto';
import { UpdateWhoWeAreFeatureDto } from './dto/update-who-we-are-feature.dto';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class WhoWeAreFeaturesService {
  constructor(
    @InjectRepository(WhoWeAreFeature)
    private readonly featureRepo: Repository<WhoWeAreFeature>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create a new WhoWeAre Feature
   */
  async create(
    req: Request,
    createDto: CreateWhoWeAreFeatureDto,
  ): Promise<WhoWeAreFeature> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    createDto.title = createDto.title.trim();

    const exists = await this.featureRepo.exists({
      where: {
        title: createDto.title,
        who_we_are_id: createDto.who_we_are_id,
      },
    });
    if (exists)
      throw new BadRequestException('Feature with this title already exists.');

    const feature = this.featureRepo.create({
      ...createDto,
      added_by: String(userId),
    });

    return this.featureRepo.save(feature);
  }

  /**
   * Get all WhoWeAre Features
   */
  async findAll(query?: any): Promise<IPagination<WhoWeAreFeatureResponseDto>> {
    return this.dataQueryService.execute<WhoWeAreFeatureResponseDto>({
      repository: this.featureRepo,
      alias: 'feature',
      pagination: query,
      searchableFields: ['title', 'description'],
      select: [
        'id',
        'who_we_are_id',
        'title',
        'description',
        'addedBy',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
    });
  }

  /**
   * Get single WhoWeAre Feature by UUID
   */
  async findOne(id: string): Promise<WhoWeAreFeatureResponseDto> {
    const feature = await this.featureRepo.findOne({ where: { id } });
    if (!feature) throw new NotFoundException('Feature not found.');
    return feature;
  }

  /**
   * Update WhoWeAre Feature
   */
  async update(
    id: string,
    updateDto: UpdateWhoWeAreFeatureDto,
  ): Promise<WhoWeAreFeature> {
    const feature = await this.featureRepo.findOne({ where: { id } });
    if (!feature) throw new NotFoundException('Feature not found.');

    if (updateDto.title) {
      updateDto.title = updateDto.title.trim();
      const exists = await this.featureRepo.exists({
        where: { title: updateDto.title, id: Not(id) },
      });
      if (exists)
        throw new BadRequestException(
          'Feature with this title already exists.',
        );
    }

    Object.assign(feature, updateDto);
    return this.featureRepo.save(feature);
  }

  /**
   * Soft delete WhoWeAre Feature
   */
  async remove(id: string): Promise<void> {
    const feature = await this.featureRepo.findOne({ where: { id } });
    if (!feature) throw new NotFoundException('Feature not found.');

    const result = await this.featureRepo.softDelete(id);
    if (!result.affected) throw new BadRequestException('Delete failed.');
  }
}
