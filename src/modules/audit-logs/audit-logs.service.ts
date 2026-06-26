// import {
//   Injectable,
//   ForbiddenException,
//   BadRequestException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, Between } from 'typeorm';
// import { Request } from 'express';

// import {
//   AuditLog,
//   AuditAction,
//   AuditEntityType,
// } from './entities/audit-log.entity';
// import {
//   AuditLogFilterDto,
//   AuditLogResponseDto,
//   CreateAuditLogDto,
// } from './dto/create-audit-log.dto';

// import { DataQueryService } from 'src/common/data-query/data-query.service';
// import { IPagination } from 'src/common/data-query/pagination.interface';

// @Injectable()
// export class AuditLogsService {
//   constructor(
//     @InjectRepository(AuditLog)
//     private readonly auditLogRepo: Repository<AuditLog>,
//     private readonly dataQueryService: DataQueryService,
//   ) {}

//   /**
//    * ✅ CREATE AUDIT LOG (Internal use)
//    */
//   async create(dto: CreateAuditLogDto, req?: Request): Promise<AuditLog> {
//     const auditLog = this.auditLogRepo.create({
//       ...dto,
//       ip_address: dto.ip_address || req?.ip || req?.connection?.remoteAddress,
//       user_agent: dto.user_agent || req?.headers?.['user-agent'],
//     });

//     return this.auditLogRepo.save(auditLog);
//   }

//   /**
//    * ✅ GET ALL AUDIT LOGS (Admin only)
//    */
//   async findAll(
//     req: Request,
//     query: AuditLogFilterDto,
//   ): Promise<IPagination<AuditLog>> {
//     const userRole = req?.user?.role;

//     // ✅ Only admin can view audit logs
//     if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
//       throw new ForbiddenException('Only admin can view audit logs.');
//     }

//     const filters: any = {};

//     if (query.user_id) {
//       filters.user_id = query.user_id;
//     }

//     if (query.action) {
//       filters.action = query.action;
//     }

//     if (query.entity_name) {
//       filters.entity_name = query.entity_name;
//     }

//     if (query.entity_id) {
//       filters.entity_id = query.entity_id;
//     }

//     if (query.from_date && query.to_date) {
//       filters.created_at = Between(
//         new Date(query.from_date),
//         new Date(query.to_date),
//       );
//     } else if (query.from_date) {
//       filters.created_at = { $gte: new Date(query.from_date) };
//     } else if (query.to_date) {
//       filters.created_at = { $lte: new Date(query.to_date) };
//     }

//     return this.dataQueryService.execute<AuditLog>({
//       repository: this.auditLogRepo,
//       alias: 'audit_log',
//       pagination: query,
//       filters,
//       relations: ['user'],
//       searchableFields: [
//         'user.name',
//         'user.email',
//         'entity_id',
//         'old_data',
//         'new_data',
//       ],
//       orderBy: {
//         created_at: 'DESC',
//       },
//       select: [
//         'id',
//         'user_id',
//         'action',
//         'entity_name',
//         'entity_id',
//         'old_data',
//         'new_data',
//         'changes',
//         'ip_address',
//         'user_agent',
//         'metadata',
//         'created_at',
//       ],
//     });
//   }

//   /**
//    * ✅ GET USER AUDIT LOGS
//    */
//   async getUserAuditLogs(
//     req: Request,
//     userId: string,
//     query: AuditLogFilterDto,
//   ): Promise<IPagination<AuditLog>> {
//     const currentUserId = req?.user?.sub;
//     const userRole = req?.user?.role;

//     const isAdmin = userRole === 'admin' || userRole === 'super_admin';
//     const isOwner = currentUserId === userId;

//     if (!isAdmin && !isOwner) {
//       throw new ForbiddenException('You can only view your own audit logs.');
//     }

//     const filters: any = {
//       user_id: userId,
//     };

//     if (query.action) {
//       filters.action = query.action;
//     }

//     if (query.entity_name) {
//       filters.entity_name = query.entity_name;
//     }

//     if (query.from_date && query.to_date) {
//       filters.created_at = Between(
//         new Date(query.from_date),
//         new Date(query.to_date),
//       );
//     } else if (query.from_date) {
//       filters.created_at = { $gte: new Date(query.from_date) };
//     } else if (query.to_date) {
//       filters.created_at = { $lte: new Date(query.to_date) };
//     }

//     return this.dataQueryService.execute<AuditLog>({
//       repository: this.auditLogRepo,
//       alias: 'audit_log',
//       pagination: query,
//       filters,
//       relations: ['user'],
//       orderBy: {
//         created_at: 'DESC',
//       },
//       select: [
//         'id',
//         'user_id',
//         'action',
//         'entity_name',
//         'entity_id',
//         'old_data',
//         'new_data',
//         'changes',
//         'ip_address',
//         'user_agent',
//         'metadata',
//         'created_at',
//       ],
//     });
//   }

//   /**
//    * ✅ GET ENTITY AUDIT LOGS
//    */
//   async getEntityAuditLogs(
//     req: Request,
//     entityName: AuditEntityType,
//     entityId: string,
//     query: AuditLogFilterDto,
//   ): Promise<IPagination<AuditLog>> {
//     const userRole = req?.user?.role;

//     // ✅ Only admin can view entity audit logs
//     if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
//       throw new ForbiddenException('Only admin can view entity audit logs.');
//     }

//     const filters: any = {
//       entity_name: entityName,
//       entity_id: entityId,
//     };

//     if (query.action) {
//       filters.action = query.action;
//     }

//     if (query.from_date && query.to_date) {
//       filters.created_at = Between(
//         new Date(query.from_date),
//         new Date(query.to_date),
//       );
//     } else if (query.from_date) {
//       filters.created_at = { $gte: new Date(query.from_date) };
//     } else if (query.to_date) {
//       filters.created_at = { $lte: new Date(query.to_date) };
//     }

//     return this.dataQueryService.execute<AuditLog>({
//       repository: this.auditLogRepo,
//       alias: 'audit_log',
//       pagination: query,
//       filters,
//       relations: ['user'],
//       orderBy: {
//         created_at: 'DESC',
//       },
//       select: [
//         'id',
//         'user_id',
//         'action',
//         'entity_name',
//         'entity_id',
//         'old_data',
//         'new_data',
//         'changes',
//         'ip_address',
//         'user_agent',
//         'metadata',
//         'created_at',
//       ],
//     });
//   }

//   /**
//    * ✅ GET SINGLE AUDIT LOG
//    */
//   async findOne(req: Request, id: string): Promise<AuditLogResponseDto> {
//     const userRole = req?.user?.role;

//     // ✅ Only admin can view audit logs
//     if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
//       throw new ForbiddenException('Only admin can view audit logs.');
//     }

//     const auditLog = await this.auditLogRepo.findOne({
//       where: { id },
//       relations: ['user'],
//     });

//     if (!auditLog) {
//       throw new BadRequestException('Audit log not found.');
//     }

//     return this.mapToResponseDto(auditLog);
//   }

//   /**
//    * ✅ GET AUDIT LOG STATS (Admin only)
//    */
//   async getStats(req: Request): Promise<{
//     total_logs: number;
//     today: number;
//     this_week: number;
//     this_month: number;
//     actions_breakdown: { action: string; count: number }[];
//     entities_breakdown: { entity: string; count: number }[];
//   }> {
//     const userRole = req?.user?.role;

//     if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
//       throw new ForbiddenException('Only admin can view audit log stats.');
//     }

//     const totalLogs = await this.auditLogRepo.count();

//     // Today
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const todayLogs = await this.auditLogRepo.count({
//       where: {
//         created_at: Between(today, new Date()),
//       },
//     });

//     // This week
//     const weekStart = new Date();
//     weekStart.setDate(weekStart.getDate() - weekStart.getDay());
//     weekStart.setHours(0, 0, 0, 0);
//     const weekLogs = await this.auditLogRepo.count({
//       where: {
//         created_at: Between(weekStart, new Date()),
//       },
//     });

//     // This month
//     const monthStart = new Date();
//     monthStart.setDate(1);
//     monthStart.setHours(0, 0, 0, 0);
//     const monthLogs = await this.auditLogRepo.count({
//       where: {
//         created_at: Between(monthStart, new Date()),
//       },
//     });

//     // Actions breakdown
//     const actionsBreakdown = await this.auditLogRepo
//       .createQueryBuilder('audit_log')
//       .select('audit_log.action', 'action')
//       .addSelect('COUNT(audit_log.id)', 'count')
//       .groupBy('audit_log.action')
//       .getRawMany();

//     // Entities breakdown
//     const entitiesBreakdown = await this.auditLogRepo
//       .createQueryBuilder('audit_log')
//       .select('audit_log.entity_name', 'entity')
//       .addSelect('COUNT(audit_log.id)', 'count')
//       .groupBy('audit_log.entity_name')
//       .getRawMany();

//     return {
//       total_logs: totalLogs,
//       today: todayLogs,
//       this_week: weekLogs,
//       this_month: monthLogs,
//       actions_breakdown: actionsBreakdown.map((item) => ({
//         action: item.action,
//         count: parseInt(item.count),
//       })),
//       entities_breakdown: entitiesBreakdown.map((item) => ({
//         entity: item.entity,
//         count: parseInt(item.count),
//       })),
//     };
//   }

//   /**
//    * ✅ CLEANUP OLD AUDIT LOGS (Admin only)
//    */
//   async cleanup(
//     req: Request,
//     days: number = 90,
//   ): Promise<{ message: string; deleted_count: number }> {
//     const userRole = req?.user?.role;

//     if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
//       throw new ForbiddenException('Only admin can cleanup audit logs.');
//     }

//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - days);

//     const result = await this.auditLogRepo
//       .createQueryBuilder()
//       .delete()
//       .where('created_at < :cutoffDate', { cutoffDate })
//       .execute();

//     return {
//       message: `Audit logs older than ${days} days deleted successfully.`,
//       deleted_count: result.affected || 0,
//     };
//   }

//   /**
//    * 📦 HELPER: Map to Response DTO
//    */
//   private mapToResponseDto(auditLog: AuditLog): AuditLogResponseDto {
//     return {
//       id: auditLog.id,
//       user_id: auditLog.user_id,
//       action: auditLog.action,
//       entity_name: auditLog.entity_name,
//       entity_id: auditLog.entity_id,
//       old_data: auditLog.old_data,
//       new_data: auditLog.new_data,
//       changes: auditLog.changes,
//       ip_address: auditLog.ip_address,
//       user_agent: auditLog.user_agent,
//       metadata: auditLog.metadata,
//       created_at: auditLog.created_at,

//       user: auditLog.user
//         ? {
//             id: auditLog.user.id,
//             name: auditLog.user.name,
//             email: auditLog.user.email,
//           }
//         : undefined,
//     };
//   }
// }

// src/modules/audit-logs/audit-logs.service.ts
import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Brackets } from 'typeorm';
import { Request } from 'express';

import {
  AuditLog,
  AuditAction,
  AuditEntityType,
} from './entities/audit-log.entity';
import {
  AuditLogFilterDto,
  AuditLogResponseDto,
  CreateAuditLogDto,
} from './dto/create-audit-log.dto';

import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * ✅ CREATE AUDIT LOG
   */
  async create(dto: CreateAuditLogDto, req?: Request): Promise<AuditLog> {
    const auditLog = this.auditLogRepo.create({
      ...dto,
      ip_address: dto.ip_address || req?.ip || req?.connection?.remoteAddress,
      user_agent: dto.user_agent || req?.headers?.['user-agent'],
    });

    return this.auditLogRepo.save(auditLog);
  }

  /**
   * ✅ GET ALL AUDIT LOGS (Admin only)
   */
  async findAll(
    req: Request,
    query: AuditLogFilterDto,
  ): Promise<IPagination<AuditLog>> {
    const userRole = req?.user?.role;

    // ✅ Only admin can view audit logs
    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      throw new ForbiddenException('Only admin can view audit logs.');
    }

    // ✅ Build pagination query
    const paginationQuery: PaginationQueryDto = {
      page: query.page || 1,
      limit: query.limit || 10,
      search: query.search || '',
      sort_by: query.sort_by || 'created_at',
      sort_order: query.sort_order || 'DESC',
    };

    // ✅ Build filters
    const filters: any = {};

    if (query.user_id) {
      filters.user_id = query.user_id;
    }

    if (query.action) {
      filters.action = query.action;
    }

    if (query.entity_name) {
      filters.entity_name = query.entity_name;
    }

    if (query.entity_id) {
      filters.entity_id = query.entity_id;
    }

    // ✅ Handle date range using additionalWhere
    let additionalWhere: string | undefined;
    const parameters: Record<string, any> = {};

    if (query.from_date && query.to_date) {
      additionalWhere = `audit_log.created_at BETWEEN :from_date AND :to_date`;
      parameters.from_date = new Date(query.from_date);
      parameters.to_date = new Date(query.to_date);
    } else if (query.from_date) {
      additionalWhere = `audit_log.created_at >= :from_date`;
      parameters.from_date = new Date(query.from_date);
    } else if (query.to_date) {
      additionalWhere = `audit_log.created_at <= :to_date`;
      parameters.to_date = new Date(query.to_date);
    }

    // ✅ Execute query with DataQueryService
    return this.dataQueryService.execute<AuditLog>({
      repository: this.auditLogRepo,
      alias: 'audit_log',
      pagination: paginationQuery,
      searchableFields: [
        'user.name',
        'user.email',
        'entity_id',
        'old_data',
        'new_data',
      ],
      filterableFields: ['user_id', 'action', 'entity_name', 'entity_id'],
      relations: ['user'],
      select: [
        'id',
        'user_id',
        'action',
        'entity_name',
        'entity_id',
        'old_data',
        'new_data',
        'changes',
        'ip_address',
        'user_agent',
        'metadata',
        'created_at',
      ],
      filters,
      additionalWhere,
      parameters,
      orderBy: {
        created_at: 'DESC',
      },
    });
  }

  /**
   * ✅ GET USER AUDIT LOGS
   */
  async getUserAuditLogs(
    req: Request,
    userId: string,
    query: AuditLogFilterDto,
  ): Promise<IPagination<AuditLog>> {
    const currentUserId = req?.user?.sub;
    const userRole = req?.user?.role;

    if (!currentUserId) {
      throw new UnauthorizedException('Authentication required.');
    }

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isOwner = currentUserId === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You can only view your own audit logs.');
    }

    // ✅ Build pagination query
    const paginationQuery: PaginationQueryDto = {
      page: query.page || 1,
      limit: query.limit || 10,
      search: query.search || '',
      sort_by: query.sort_by || 'created_at',
      sort_order: query.sort_order || 'DESC',
    };

    // ✅ Build filters
    const filters: any = {
      user_id: userId,
    };

    if (query.action) {
      filters.action = query.action;
    }

    if (query.entity_name) {
      filters.entity_name = query.entity_name;
    }

    // ✅ Handle date range
    let additionalWhere: string | undefined;
    const parameters: Record<string, any> = {};

    if (query.from_date && query.to_date) {
      additionalWhere = `audit_log.created_at BETWEEN :from_date AND :to_date`;
      parameters.from_date = new Date(query.from_date);
      parameters.to_date = new Date(query.to_date);
    } else if (query.from_date) {
      additionalWhere = `audit_log.created_at >= :from_date`;
      parameters.from_date = new Date(query.from_date);
    } else if (query.to_date) {
      additionalWhere = `audit_log.created_at <= :to_date`;
      parameters.to_date = new Date(query.to_date);
    }

    return this.dataQueryService.execute<AuditLog>({
      repository: this.auditLogRepo,
      alias: 'audit_log',
      pagination: paginationQuery,
      searchableFields: ['user.name', 'user.email', 'entity_id'],
      filterableFields: ['user_id', 'action', 'entity_name', 'entity_id'],
      relations: ['user'],
      select: [
        'id',
        'user_id',
        'action',
        'entity_name',
        'entity_id',
        'old_data',
        'new_data',
        'changes',
        'ip_address',
        'user_agent',
        'metadata',
        'created_at',
      ],
      filters,
      additionalWhere,
      parameters,
      orderBy: {
        created_at: 'DESC',
      },
    });
  }

  /**
   * ✅ GET ENTITY AUDIT LOGS (Admin only)
   */
  async getEntityAuditLogs(
    req: Request,
    entityName: AuditEntityType,
    entityId: string,
    query: AuditLogFilterDto,
  ): Promise<IPagination<AuditLog>> {
    const userRole = req?.user?.role;

    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      throw new ForbiddenException('Only admin can view entity audit logs.');
    }

    // ✅ Build pagination query
    const paginationQuery: PaginationQueryDto = {
      page: query.page || 1,
      limit: query.limit || 10,
      search: query.search || '',
      sort_by: query.sort_by || 'created_at',
      sort_order: query.sort_order || 'DESC',
    };

    // ✅ Build filters
    const filters: any = {
      entity_name: entityName,
      entity_id: entityId,
    };

    if (query.action) {
      filters.action = query.action;
    }

    // ✅ Handle date range
    let additionalWhere: string | undefined;
    const parameters: Record<string, any> = {};

    if (query.from_date && query.to_date) {
      additionalWhere = `audit_log.created_at BETWEEN :from_date AND :to_date`;
      parameters.from_date = new Date(query.from_date);
      parameters.to_date = new Date(query.to_date);
    } else if (query.from_date) {
      additionalWhere = `audit_log.created_at >= :from_date`;
      parameters.from_date = new Date(query.from_date);
    } else if (query.to_date) {
      additionalWhere = `audit_log.created_at <= :to_date`;
      parameters.to_date = new Date(query.to_date);
    }

    return this.dataQueryService.execute<AuditLog>({
      repository: this.auditLogRepo,
      alias: 'audit_log',
      pagination: paginationQuery,
      searchableFields: ['user.name', 'user.email'],
      filterableFields: ['user_id', 'action', 'entity_name', 'entity_id'],
      relations: ['user'],
      select: [
        'id',
        'user_id',
        'action',
        'entity_name',
        'entity_id',
        'old_data',
        'new_data',
        'changes',
        'ip_address',
        'user_agent',
        'metadata',
        'created_at',
      ],
      filters,
      additionalWhere,
      parameters,
      orderBy: {
        created_at: 'DESC',
      },
    });
  }

  /**
   * ✅ GET SINGLE AUDIT LOG (Admin only)
   */
  async findOne(req: Request, id: string): Promise<AuditLogResponseDto> {
    const userRole = req?.user?.role;

    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      throw new ForbiddenException('Only admin can view audit logs.');
    }

    const auditLog = await this.auditLogRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!auditLog) {
      throw new BadRequestException('Audit log not found.');
    }

    return this.mapToResponseDto(auditLog);
  }

  /**
   * ✅ GET AUDIT LOG STATS (Admin only)
   */
  async getStats(req: Request): Promise<{
    total_logs: number;
    today: number;
    this_week: number;
    this_month: number;
    actions_breakdown: { action: string; count: number }[];
    entities_breakdown: { entity: string; count: number }[];
  }> {
    const userRole = req?.user?.role;

    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      throw new ForbiddenException('Only admin can view audit log stats.');
    }

    const totalLogs = await this.auditLogRepo.count();

    // Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = await this.auditLogRepo.count({
      where: {
        created_at: Between(today, new Date()),
      },
    });

    // This week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekLogs = await this.auditLogRepo.count({
      where: {
        created_at: Between(weekStart, new Date()),
      },
    });

    // This month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthLogs = await this.auditLogRepo.count({
      where: {
        created_at: Between(monthStart, new Date()),
      },
    });

    // Actions breakdown
    const actionsBreakdown = await this.auditLogRepo
      .createQueryBuilder('audit_log')
      .select('audit_log.action', 'action')
      .addSelect('COUNT(audit_log.id)', 'count')
      .groupBy('audit_log.action')
      .getRawMany();

    // Entities breakdown
    const entitiesBreakdown = await this.auditLogRepo
      .createQueryBuilder('audit_log')
      .select('audit_log.entity_name', 'entity')
      .addSelect('COUNT(audit_log.id)', 'count')
      .groupBy('audit_log.entity_name')
      .getRawMany();

    return {
      total_logs: totalLogs,
      today: todayLogs,
      this_week: weekLogs,
      this_month: monthLogs,
      actions_breakdown: actionsBreakdown.map((item) => ({
        action: item.action,
        count: parseInt(item.count),
      })),
      entities_breakdown: entitiesBreakdown.map((item) => ({
        entity: item.entity,
        count: parseInt(item.count),
      })),
    };
  }

  /**
   * ✅ CLEANUP OLD AUDIT LOGS (Admin only)
   */
  async cleanup(
    req: Request,
    days: number = 90,
  ): Promise<{ message: string; deleted_count: number }> {
    const userRole = req?.user?.role;

    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      throw new ForbiddenException('Only admin can cleanup audit logs.');
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.auditLogRepo
      .createQueryBuilder()
      .delete()
      .where('created_at < :cutoffDate', { cutoffDate })
      .execute();

    return {
      message: `Audit logs older than ${days} days deleted successfully.`,
      deleted_count: result.affected || 0,
    };
  }

  /**
   * 📦 HELPER: Map to Response DTO
   */
  private mapToResponseDto(auditLog: AuditLog): AuditLogResponseDto {
    return {
      id: auditLog.id,
      user_id: auditLog.user_id,
      action: auditLog.action,
      entity_name: auditLog.entity_name,
      entity_id: auditLog.entity_id,
      old_data: auditLog.old_data,
      new_data: auditLog.new_data,
      changes: auditLog.changes,
      ip_address: auditLog.ip_address,
      user_agent: auditLog.user_agent,
      metadata: auditLog.metadata,
      created_at: auditLog.created_at,

      user: auditLog.user
        ? {
            id: auditLog.user.id,
            name: auditLog.user.name ?? '',
            email: auditLog.user.email,
          }
        : undefined,
    };
  }
}
