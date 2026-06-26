import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';

import { InventoryLog } from './entities/inventory-log.entity';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';
import { UpdateInventoryLogDto } from './dto/update-inventory-log.dto';

import { Role } from 'src/auth/enums/role-type.enum';

@Injectable()
export class InventoryLogsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(InventoryLog)
    private readonly inventoryLogRepo: Repository<InventoryLog>,
  ) {}

  /**
   * CREATE INVENTORY LOG
   */
  async create(req: Request, dto: CreateInventoryLogDto) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

    if (!isAdmin) {
      throw new ForbiddenException('Only admin can create inventory logs');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(InventoryLog);

      const log = repo.create(dto);

      const saved = await repo.save(log);

      await queryRunner.commitTransaction();

      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * GET ALL INVENTORY LOGS
   */
  async findAll(req: Request, query: any) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const where: any = {};

    if (query.product_variant_id) {
      where.product_variant_id = query.product_variant_id;
    }

    if (query.type) {
      where.type = query.type;
    }

    return this.inventoryLogRepo.find({
      where,
      relations: ['productVariant'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  /**
   * GET SINGLE INVENTORY LOG
   */
  async findOne(req: Request, id: string) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const log = await this.inventoryLogRepo.findOne({
      where: { id },
      relations: ['productVariant'],
    });

    if (!log) {
      throw new NotFoundException('Inventory log not found');
    }

    return log;
  }

  /**
   * UPDATE INVENTORY LOG
   */
  async update(req: Request, id: string, dto: UpdateInventoryLogDto) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

    if (!isAdmin) {
      throw new ForbiddenException('Only admin can update inventory logs');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(InventoryLog);

      const log = await repo.findOne({
        where: { id },
      });

      if (!log) {
        throw new NotFoundException('Inventory log not found');
      }

      Object.assign(log, dto);

      const updated = await repo.save(log);

      await queryRunner.commitTransaction();

      return updated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * DELETE INVENTORY LOG
   */
  async remove(req: Request, id: string) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

    if (!isAdmin) {
      throw new ForbiddenException('Only admin can delete inventory logs');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(InventoryLog);

      const log = await repo.findOne({
        where: { id },
      });

      if (!log) {
        throw new NotFoundException('Inventory log not found');
      }

      await repo.remove(log);

      await queryRunner.commitTransaction();

      return {
        message: 'Inventory log deleted successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
