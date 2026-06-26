import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsInt, Min } from 'class-validator';

import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetCartItemBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by Cart ID',
    example: '2d45f9d8-5b67-46d5-b4b2-9b7d15d27e21',
  })
  @IsOptional()
  @IsUUID()
  cart_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by Product Variant ID',
    example: 'ab12cd34-5678-90ef-gh12-34567890ijkl',
  })
  @IsOptional()
  @IsUUID()
  product_variant_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by quantity',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class GetCartItemDto extends IntersectionType(
  GetCartItemBaseDto,
  PaginationQueryDto,
) {}
