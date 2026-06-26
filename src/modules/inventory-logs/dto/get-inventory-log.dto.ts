import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { InventoryLogType } from './create-inventory-log.dto';

export class GetInventoryLogDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  product_variant_id?: string;

  @ApiPropertyOptional({
    enum: InventoryLogType,
  })
  @IsOptional()
  @IsEnum(InventoryLogType)
  type?: InventoryLogType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  reference_id?: string;
}
