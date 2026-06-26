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

import { Cart } from './entities/cart.entity';
import { User } from '../users/entities/user.entity';

import { CreateCartDto, CartResponseDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create Cart
   */
  async create(req: Request, createDto: CreateCartDto): Promise<Cart> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const user = await this.userRepo.findOne({
      where: { id: createDto.user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const exists = await this.cartRepo.exists({
      where: {
        user_id: createDto.user_id,
      },
    });

    if (exists) {
      throw new BadRequestException('Cart already exists for this user.');
    }

    const cart = this.cartRepo.create(createDto);

    return this.cartRepo.save(cart);
  }

  /**
   * Get All Carts
   */
  async findAll(query: any): Promise<IPagination<Cart>> {
    return this.dataQueryService.execute<Cart>({
      repository: this.cartRepo,
      alias: 'cart',
      pagination: query,

      searchableFields: [],

      select: ['id', 'user_id', 'created_at', 'updated_at'],
    });
  }

  /**
   * Get Single Cart
   */
  async findOne(id: string): Promise<CartResponseDto> {
    const cart = await this.cartRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    return {
      id: cart.id,
      user_id: cart.user_id,

      user: cart.user
        ? {
            id: cart.user.id,
            name: cart.user.name ?? '',
            email: cart.user.email,
          }
        : undefined,

      created_at: cart.created_at,
      updated_at: cart.updated_at,
    };
  }

  /**
   * Update Cart
   */
  async update(
    req: Request,
    id: string,
    updateDto: UpdateCartDto,
  ): Promise<Cart> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const cart = await this.cartRepo.findOne({
      where: { id },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    if (updateDto.user_id) {
      const user = await this.userRepo.findOne({
        where: {
          id: updateDto.user_id,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const exists = await this.cartRepo.exists({
        where: {
          user_id: updateDto.user_id,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException('Cart already exists for this user.');
      }
    }

    Object.assign(cart, updateDto);

    return this.cartRepo.save(cart);
  }

  /**
   * Delete Cart
   */
  async remove(req: Request, id: string): Promise<void> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const cart = await this.cartRepo.findOne({
      where: { id },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    if (cart.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own cart.');
    }

    const result = await this.cartRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
