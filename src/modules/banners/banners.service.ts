import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BannerResponseDto, CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Role } from 'src/auth/enums/role-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { GetBannerDto } from './dto/get-banner.dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepo: Repository<Banner>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * CREATE BANNER
   */
  async create(req: Request, dto: CreateBannerDto): Promise<BannerResponseDto> {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }

    const banner = this.bannerRepo.create({
      title: dto.title,
      image_url: dto.image_url,
      redirect_url: dto.redirect_url,
      position: dto.position,
      is_active: dto.is_active ?? true,
      added_by: String(user.sub),
    });

    const savedBanner = await this.bannerRepo.save(banner);

    return savedBanner;
  }

  /**
   * GET ALL BANNERS
   */
  async findAll(query: GetBannerDto): Promise<IPagination<Banner>> {
    return this.dataQueryService.execute<Banner>({
      repository: this.bannerRepo,
      alias: 'banner',
      pagination: query,
      searchableFields: ['title'],
      filterableFields: ['position', 'is_active'],
      relations: ['addedBy'],
      select: [
        'id',
        'title',
        'image_url',
        'redirect_url',
        'position',
        'is_active',
        'created_at',
        'updated_at',
      ],
      selectRelations: ['addedBy.id', 'addedBy.name', 'addedBy.email'],
    });
  }

  /**
   * GET SINGLE BANNER
   */
  async findOne(req: Request, id: string): Promise<Banner> {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }

    const banner = await this.bannerRepo.findOne({
      where: { id },
      relations: ['addedBy'],
    });

    if (!banner) {
      throw new NotFoundException('Banner not found.');
    }

    return banner;
  }

  /**
   * UPDATE BANNER
   */
  async update(
    req: Request,
    id: string,
    dto: UpdateBannerDto,
  ): Promise<BannerResponseDto> {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }

    const banner = await this.bannerRepo.findOne({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found.');
    }

    Object.assign(banner, dto);

    await this.bannerRepo.save(banner);

    return this.findOne(req, id);
  }

  /**
   * DELETE BANNER
   */
  async remove(req: Request, id: string): Promise<{ message: string }> {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }

    const banner = await this.bannerRepo.findOne({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found.');
    }

    await this.bannerRepo.remove(banner);

    return {
      message: 'Banner deleted successfully.',
    };
  }
}
