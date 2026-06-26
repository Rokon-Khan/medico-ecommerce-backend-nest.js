// src/modules/prescriptions/prescriptions.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not } from 'typeorm';
import { Request } from 'express';

import {
  Prescription,
  PrescriptionStatus,
} from './entities/prescription.entity';
import {
  CreatePrescriptionDto,
  PrescriptionResponseDto,
} from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { Role } from 'src/auth/enums/role-type.enum';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,
    private readonly dataQueryService: DataQueryService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   *  CREATE PRESCRIPTION
   */
  async create(
    req: Request,
    dto: CreatePrescriptionDto,
  ): Promise<PrescriptionResponseDto> {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const prescriptionRepo = queryRunner.manager.getRepository(Prescription);

      // Check pending prescription
      const pendingPrescription = await prescriptionRepo.findOne({
        where: {
          user_id: String(userId),
          status: PrescriptionStatus.PENDING,
        },
      });

      if (pendingPrescription) {
        throw new BadRequestException(
          'You already have a pending prescription.',
        );
      }

      const prescription = prescriptionRepo.create({
        user: {
          id: String(userId),
        },
        image_url: dto.image_url,
        status: dto.status ?? PrescriptionStatus.PENDING,
        admin_note: dto.admin_note,
      });

      const savedPrescription = await prescriptionRepo.save(prescription);

      await queryRunner.commitTransaction();

      return await this.getPrescriptionWithRelations(savedPrescription.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  GET ALL PRESCRIPTIONS
 
   */
  async findAll(req: Request, query: any): Promise<IPagination<Prescription>> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN;
    const isManager = userRole === Role.MANAGER;

    const filters: any = {};

    // Status filter
    if (query.status) {
      filters.status = query.status;
    }

    // User filter - only admin/manager can filter by user
    if (query.user_id) {
      if (!isAdmin && !isManager && query.user_id !== userId) {
        throw new ForbiddenException(
          'You can only view your own prescriptions.',
        );
      }
      filters.user_id = query.user_id;
    } else if (!isAdmin && !isManager) {
      // Regular users can only see their own
      filters.user_id = userId;
    }

    // Date range filter
    if (query.from_date) {
      filters.created_at = { $gte: query.from_date };
    }

    if (query.to_date) {
      filters.created_at = { ...filters.created_at, $lte: query.to_date };
    }

    return this.dataQueryService.execute<Prescription>({
      repository: this.prescriptionRepo,
      alias: 'prescription',
      pagination: query,
      filters,
      relations: ['user'],
      searchableFields: ['user.name', 'user.email', 'admin_note'],
      select: [
        'id',
        'image_url',
        'status',
        'admin_note',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   *  GET SINGLE PRESCRIPTION
   */
  async findOne(req: Request, id: string): Promise<PrescriptionResponseDto> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const prescription = await this.prescriptionRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found.');
    }

    //  Authorization check
    const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN;
    const isManager = userRole === Role.MANAGER;
    const isOwner = prescription.user_id === userId;

    if (!isAdmin && !isManager && !isOwner) {
      throw new ForbiddenException('You can only view your own prescriptions.');
    }

    return this.mapToResponseDto(prescription);
  }

  /**
   *  GET USER'S PRESCRIPTIONS
   */
  async getUserPrescriptions(
    req: Request,
    userId: string,
    query: any,
  ): Promise<IPagination<Prescription>> {
    const currentUserId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!currentUserId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN;
    const isManager = userRole === Role.MANAGER;
    const isOwner = currentUserId === userId;

    if (!isAdmin && !isManager && !isOwner) {
      throw new ForbiddenException('You can only view your own prescriptions.');
    }

    const filters: any = {
      user_id: userId,
    };

    if (query.status) {
      filters.status = query.status;
    }

    return this.dataQueryService.execute<Prescription>({
      repository: this.prescriptionRepo,
      alias: 'prescription',
      pagination: query,
      filters,
      relations: ['user'],
      select: [
        'id',
        'image_url',
        'status',
        'admin_note',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   *  UPDATE PRESCRIPTION

   */
  async update(
    req: Request,
    id: string,
    dto: UpdatePrescriptionDto,
  ): Promise<PrescriptionResponseDto> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const prescriptionRepo = queryRunner.manager.getRepository(Prescription);

      const prescription = await prescriptionRepo.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!prescription) {
        throw new NotFoundException('Prescription not found.');
      }

      const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN;
      const isManager = userRole === Role.MANAGER;
      const isOwner = prescription.user_id === userId;

      // ✅ Authorization check
      if (!isAdmin && !isManager && !isOwner) {
        throw new ForbiddenException(
          'You can only update your own prescriptions.',
        );
      }

      //  User can only update pending prescriptions
      if (
        !isAdmin &&
        !isManager &&
        prescription.status !== PrescriptionStatus.PENDING
      ) {
        throw new ForbiddenException(
          'You can only update pending prescriptions.',
        );
      }

      //  Admin/Manager can't change status through update
      // They should use approve/reject endpoints
      if (dto.status && !isAdmin && !isManager) {
        throw new BadRequestException(
          'You cannot change prescription status directly.',
        );
      }

      //  If status is being updated by admin/manager
      if (dto.status && (isAdmin || isManager)) {
        // Only allow specific status changes
        if (dto.status === PrescriptionStatus.PENDING) {
          throw new BadRequestException(
            'Cannot set status to PENDING. Use approve or reject.',
          );
        }
      }

      Object.assign(prescription, dto);
      const updatedPrescription = await prescriptionRepo.save(prescription);

      await queryRunner.commitTransaction();

      return this.getPrescriptionWithRelations(updatedPrescription.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  APPROVE PRESCRIPTION (Admin/Manager only)
   */
  async approve(req: Request, id: string): Promise<PrescriptionResponseDto> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN;
    const isManager = userRole === Role.MANAGER;

    if (!isAdmin && !isManager) {
      throw new ForbiddenException(
        'Only admin/manager can approve prescriptions.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const prescriptionRepo = queryRunner.manager.getRepository(Prescription);

      const prescription = await prescriptionRepo.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!prescription) {
        throw new NotFoundException('Prescription not found.');
      }

      //  Can't approve already approved or rejected
      if (prescription.status === PrescriptionStatus.APPROVED) {
        throw new BadRequestException('Prescription is already approved.');
      }

      if (prescription.status === PrescriptionStatus.REJECTED) {
        throw new BadRequestException(
          'Cannot approve a rejected prescription.',
        );
      }

      prescription.status = PrescriptionStatus.APPROVED;
      prescription.admin_note = prescription.admin_note || 'Approved by admin.';

      const updatedPrescription = await prescriptionRepo.save(prescription);

      await queryRunner.commitTransaction();

      return this.getPrescriptionWithRelations(updatedPrescription.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  REJECT PRESCRIPTION (Admin/Manager only)
   */
  async reject(
    req: Request,
    id: string,
    admin_note?: string,
  ): Promise<PrescriptionResponseDto> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN;
    const isManager = userRole === Role.MANAGER;

    if (!isAdmin && !isManager) {
      throw new ForbiddenException(
        'Only admin/manager can reject prescriptions.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const prescriptionRepo = queryRunner.manager.getRepository(Prescription);

      const prescription = await prescriptionRepo.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!prescription) {
        throw new NotFoundException('Prescription not found.');
      }

      //  Can't reject already approved or rejected
      if (prescription.status === PrescriptionStatus.REJECTED) {
        throw new BadRequestException('Prescription is already rejected.');
      }

      if (prescription.status === PrescriptionStatus.APPROVED) {
        throw new BadRequestException(
          'Cannot reject an approved prescription.',
        );
      }

      prescription.status = PrescriptionStatus.REJECTED;
      prescription.admin_note = admin_note || 'Rejected by admin.';

      const updatedPrescription = await prescriptionRepo.save(prescription);

      await queryRunner.commitTransaction();

      return this.getPrescriptionWithRelations(updatedPrescription.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  DELETE PRESCRIPTION

   */
  async remove(req: Request, id: string): Promise<{ message: string }> {
    const userId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const prescription = await this.prescriptionRepo.findOne({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found.');
    }

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isManager = userRole === 'manager';
    const isOwner = prescription.user_id === userId;

    //  Authorization check
    if (!isAdmin && !isManager && !isOwner) {
      throw new ForbiddenException(
        'You can only delete your own prescriptions.',
      );
    }

    //  User can only delete pending prescriptions
    if (
      !isAdmin &&
      !isManager &&
      prescription.status !== PrescriptionStatus.PENDING
    ) {
      throw new ForbiddenException(
        'You can only delete pending prescriptions.',
      );
    }

    const result = await this.prescriptionRepo.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Delete failed.');
    }

    return {
      message: 'Prescription deleted successfully.',
    };
  }

  /**
   *  GET PRESCRIPTION STATS (Admin only)
   */
  async getStats(req: Request): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    last_7_days: number;
    last_30_days: number;
    pending_percentage: number;
  }> {
    const userRole = req?.user?.role;

    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      throw new ForbiddenException('Only admin can view prescription stats.');
    }

    const total = await this.prescriptionRepo.count();
    const pending = await this.prescriptionRepo.count({
      where: { status: PrescriptionStatus.PENDING },
    });
    const approved = await this.prescriptionRepo.count({
      where: { status: PrescriptionStatus.APPROVED },
    });
    const rejected = await this.prescriptionRepo.count({
      where: { status: PrescriptionStatus.REJECTED },
    });

    const last7Days = await this.prescriptionRepo
      .createQueryBuilder('prescription')
      .where('prescription.created_at >= NOW() - INTERVAL 7 DAY')
      .getCount();

    const last30Days = await this.prescriptionRepo
      .createQueryBuilder('prescription')
      .where('prescription.created_at >= NOW() - INTERVAL 30 DAY')
      .getCount();

    return {
      total,
      pending,
      approved,
      rejected,
      last_7_days: last7Days,
      last_30_days: last30Days,
      pending_percentage: total > 0 ? (pending / total) * 100 : 0,
    };
  }

  /**
   *  HELPER: Get prescription with relations
   */
  private async getPrescriptionWithRelations(
    id: string,
  ): Promise<PrescriptionResponseDto> {
    const prescription = await this.prescriptionRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found.');
    }

    return this.mapToResponseDto(prescription);
  }

  /**
   *  HELPER: Map to Response DTO
   */
  private mapToResponseDto(
    prescription: Prescription,
  ): PrescriptionResponseDto {
    return {
      id: prescription.id,
      user_id: prescription.user_id,
      image_url: prescription.image_url,
      status: prescription.status,
      admin_note: prescription.admin_note,
      created_at: prescription.created_at,
      updated_at: prescription.updated_at,

      user: prescription.user
        ? {
            id: prescription.user.id,
            name: prescription.user.name,
            email: prescription.user.email,
          }
        : undefined,
    };
  }
}
