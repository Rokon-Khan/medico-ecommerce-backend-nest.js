import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export enum PrescriptionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class CreatePrescriptionDto {
  @ApiProperty({
    example: 'https://example.com/uploads/prescription.jpg',
  })
  @IsUrl()
  image_url: string;

  @ApiProperty({
    required: false,
    example: 'Doctor prescribed antibiotics.',
  })
  @IsOptional()
  @IsString()
  admin_note?: string;

  @ApiProperty({
    enum: PrescriptionStatus,
    default: PrescriptionStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;
}

export class PrescriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty({ enum: PrescriptionStatus })
  status: PrescriptionStatus;

  @ApiProperty({ required: false })
  admin_note?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({
    required: false,
    type: Object,
  })
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export class PrescriptionFilterDto {
  @ApiProperty({ enum: PrescriptionStatus, required: false })
  @IsEnum(PrescriptionStatus)
  @IsOptional()
  status?: PrescriptionStatus;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  from_date?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  to_date?: string;
}
