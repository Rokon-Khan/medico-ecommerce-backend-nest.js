import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetProductVariantBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by SKU',
    example: 'NAPA-500-10TAB',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Filter by Strength',
    example: '500mg',
  })
  @IsOptional()
  @IsString()
  strength?: string;

  @ApiPropertyOptional({
    description: 'Filter by Pack Size',
    example: '10 Tablets',
  })
  @IsOptional()
  @IsString()
  pack_size?: string;

  @ApiPropertyOptional({
    description: 'Filter by Product ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  product_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by Active Status',
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  is_active?: boolean;
}

export class GetProductVariantDto extends IntersectionType(
  GetProductVariantBaseDto,
  PaginationQueryDto,
) {}
