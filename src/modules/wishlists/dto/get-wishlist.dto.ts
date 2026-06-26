import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetWishlistBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by User ID',
    example: '8d4c1f0d-0e17-49df-a7e3-43c83f08b2f2',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by Product ID',
    example: 'b1d0d6f3-9a1d-4c56-9b1e-6b31dfe6f28d',
  })
  @IsOptional()
  @IsUUID()
  product_id?: string;
}

export class GetWishlistDto extends IntersectionType(
  GetWishlistBaseDto,
  PaginationQueryDto,
) {}
