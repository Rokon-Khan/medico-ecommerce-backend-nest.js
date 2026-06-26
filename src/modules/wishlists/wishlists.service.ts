import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';

import { Wishlist } from './entities/wishlist.entity';
import {
  CreateWishlistDto,
  WishlistResponseDto,
} from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { Role } from 'src/auth/enums/role-type.enum';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,

    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create Wishlist
   */
  async create(req: Request, createDto: CreateWishlistDto): Promise<Wishlist> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }
    const exists = await this.wishlistRepo.exists({
      where: {
        user_id: String(userId),
        product_id: createDto.product_id,
      },
    });

    if (exists) {
      throw new BadRequestException(
        'This product already exists in your wishlist.',
      );
    }

    const wishlist = this.wishlistRepo.create({
      ...createDto,
      user_id: String(userId),
    });

    return this.wishlistRepo.save(wishlist);
  }

  /**
   * Get All Wishlists
   */
  async findAll(req: Request, query: any): Promise<IPagination<Wishlist>> {
    const user = req.user;

    if (user?.role === Role.SUPER_ADMIN || user?.role === Role.ADMIN) {
      return this.dataQueryService.execute<Wishlist>({
        repository: this.wishlistRepo,
        alias: 'wishlist',
        pagination: query,

        searchableFields: [],

        select: ['id', 'user_id', 'product_id', 'created_at', 'updated_at'],
      });
    }

    return this.dataQueryService.execute<Wishlist>({
      repository: this.wishlistRepo,
      alias: 'wishlist',
      pagination: query,

      where: {
        user_id: String(user?.sub),
      },

      searchableFields: [],

      select: ['id', 'user_id', 'product_id', 'created_at', 'updated_at'],
    });
  }

  /**
   * Get Single Wishlist
   */
  /**
   * Get Single Wishlist
   */
  async findOne(req: Request, id: string): Promise<WishlistResponseDto> {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }

    const where =
      user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN
        ? { id }
        : {
            id,
            user_id: String(user.sub),
          };

    const wishlist = await this.wishlistRepo.findOne({
      where,
      relations: ['user', 'product'],
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found.');
    }

    return {
      id: wishlist.id,

      user_id: wishlist.user_id,
      product_id: wishlist.product_id,

      user: wishlist.user
        ? {
            id: wishlist.user.id,
            name: wishlist.user.name,
            email: wishlist.user.email,
          }
        : undefined,

      product: wishlist.product
        ? {
            id: wishlist.product.id,
            name: wishlist.product.name,
            slug: wishlist.product.slug,
            thumbnail: wishlist.product.thumbnail,
          }
        : undefined,

      created_at: wishlist.created_at,
      updated_at: wishlist.updated_at,
    };
  }

  /**
   * Update Wishlist
   */
  async update(
    req: Request,
    id: string,
    updateDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const wishlist = await this.wishlistRepo.findOne({
      where: {
        id,
        user_id: String(userId),
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found.');
    }

    if (updateDto.user_id && updateDto.product_id) {
      const exists = await this.wishlistRepo.exists({
        where: {
          user_id: String(userId),
          product_id: updateDto.product_id!,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException(
          'This product already exists in the wishlist.',
        );
      }
    }

    Object.assign(wishlist, updateDto);

    return this.wishlistRepo.save(wishlist);
  }

  /**
   * Delete Wishlist
   */
  async remove(req: Request, id: string): Promise<void> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const wishlist = await this.wishlistRepo.findOne({
      where: {
        id,
        user_id: String(userId),
      },
    });

    if (!wishlist) {
      throw new NotFoundException(
        'Wishlist not found or you do not have permission.',
      );
    }

    const result = await this.wishlistRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
