// src/modules/audit-logs/dto/create-audit-log.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsUUID,
  IsString,
  IsObject,
  IsArray,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { AuditAction, AuditEntityType } from '../entities/audit-log.entity';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';
import { Type } from 'class-transformer';

export class CreateAuditLogDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ enum: AuditAction })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({ enum: AuditEntityType })
  @IsEnum(AuditEntityType)
  entity_name: AuditEntityType;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  entity_id?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  old_data?: any;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  new_data?: any;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ip_address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  user_agent?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: any;
}

export class AuditLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  user_id?: string;

  @ApiProperty({ enum: AuditAction })
  action: AuditAction;

  @ApiProperty({ enum: AuditEntityType })
  entity_name: AuditEntityType;

  @ApiProperty({ required: false })
  entity_id?: string;

  @ApiProperty({ required: false })
  old_data?: any;

  @ApiProperty({ required: false })
  new_data?: any;

  @ApiProperty({ required: false })
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];

  @ApiProperty({ required: false })
  ip_address?: string;

  @ApiProperty({ required: false })
  user_agent?: string;

  @ApiProperty({ required: false })
  metadata?: any;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ required: false })
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export class AuditLogFilterDto {
  // ==================== PAGINATION FIELDS ====================
  @ApiProperty({
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    default: 'created_at',
    description: 'Sort by field',
  })
  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @ApiProperty({
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  sort_order?: 'ASC' | 'DESC' = 'DESC';

  // ==================== FILTER FIELDS ====================
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ enum: AuditAction, required: false })
  @IsEnum(AuditAction)
  @IsOptional()
  action?: AuditAction;

  @ApiProperty({ enum: AuditEntityType, required: false })
  @IsEnum(AuditEntityType)
  @IsOptional()
  entity_name?: AuditEntityType;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  entity_id?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  from_date?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  to_date?: string;
}
