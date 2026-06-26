import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PrescriptionStatus } from './create-prescription.dto';

export class GetPrescriptionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({
    enum: PrescriptionStatus,
  })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_url?: string;
}
