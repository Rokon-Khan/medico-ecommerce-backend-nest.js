import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { Address } from './entities/address.entity';
import { CreateAddressDto, AddressResponseDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create Address
   */
  async create(req: Request, createDto: CreateAddressDto): Promise<Address> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    /**
     * Only one default address
     */
    if (createDto.is_default) {
      await this.addressRepo.update(
        {
          user_id: createDto.user_id,
          is_default: true,
        },
        {
          is_default: false,
        },
      );
    }

    const address = this.addressRepo.create(createDto);

    return this.addressRepo.save(address);
  }

  /**
   * Get All Addresses
   */
  async findAll(query: any): Promise<IPagination<Address>> {
    return this.dataQueryService.execute<Address>({
      repository: this.addressRepo,
      alias: 'address',
      pagination: query,

      searchableFields: [
        'full_name',
        'phone',
        'email',
        'division',
        'district',
        'area',
      ],

      select: [
        'id',
        'user_id',
        'full_name',
        'phone',
        'email',
        'division',
        'district',
        'area',
        'address',
        'is_default',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   * Get Single Address
   */
  async findOne(id: string): Promise<AddressResponseDto> {
    const address = await this.addressRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    return {
      id: address.id,

      user_id: address.user_id,

      full_name: address.full_name,
      phone: address.phone,
      email: address.email,

      division: address.division,
      district: address.district,
      area: address.area,
      address: address.address,

      is_default: address.is_default,

      user: address.user
        ? {
            id: address.user.id,
            name: address.user.name,
            email: address.user.email,
          }
        : undefined,

      created_at: address.created_at,
      updated_at: address.updated_at,
    };
  }

  /**
   * Update Address
   */
  async update(
    req: Request,
    id: string,
    updateDto: UpdateAddressDto,
  ): Promise<Address> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const address = await this.addressRepo.findOne({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    /**
     * User can update only own address
     */
    if (address.user_id !== String(userId)) {
      throw new ForbiddenException('You can only update your own address.');
    }

    /**
     * Set only one default address
     */
    if (updateDto.is_default) {
      await this.addressRepo.update(
        {
          user_id: address.user_id,
          is_default: true,
        },
        {
          is_default: false,
        },
      );
    }

    Object.assign(address, updateDto);

    return this.addressRepo.save(address);
  }

  /**
   * Delete Address
   */
  async remove(req: Request, id: string): Promise<void> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const address = await this.addressRepo.findOne({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    /**
     * User can delete only own address
     */
    if (address.user_id !== String(userId)) {
      throw new ForbiddenException('You can only delete your own address.');
    }

    const result = await this.addressRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }
  }
}
