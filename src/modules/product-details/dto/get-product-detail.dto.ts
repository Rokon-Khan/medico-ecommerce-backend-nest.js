import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

export class GetProductDetailBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by product id',
  })
  @IsOptional()
  @IsUUID()
  product_id?: string;

  @ApiPropertyOptional({
    description: 'Search by indication',
  })
  @IsOptional()
  @IsString()
  indication?: string;
}

export class GetProductDetailDto extends IntersectionType(
  GetProductDetailBaseDto,
  PaginationQueryDto,
) {}
