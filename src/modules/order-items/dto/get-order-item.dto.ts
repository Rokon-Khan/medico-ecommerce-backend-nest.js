import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString } from 'class-validator';

export class GetOrderItemDto {
  @ApiPropertyOptional({
    description: 'Filter by order ID',
  })
  @IsOptional()
  @IsUUID()
  order_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by product variant ID',
  })
  @IsOptional()
  @IsUUID()
  product_variant_id?: string;

  @ApiPropertyOptional({
    description: 'Search by SKU',
  })
  @IsOptional()
  @IsString()
  sku?: string;
}
