import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PrescriptionStatus } from '../entities/prescription.entity';

export class UpdatePrescriptionDto {
  @ApiProperty({
    required: false,
    example: 'https://example.com/updated-prescription.jpg',
  })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    enum: PrescriptionStatus,
    required: false,
  })
  @IsEnum(PrescriptionStatus)
  @IsOptional()
  status?: PrescriptionStatus;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  admin_note?: string;
}
