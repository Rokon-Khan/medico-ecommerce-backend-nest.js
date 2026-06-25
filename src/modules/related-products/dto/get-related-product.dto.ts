import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetRelatedProductBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by Product ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  product_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by Related Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  related_product_id?: string;
}

export class GetRelatedProductDto extends IntersectionType(
  GetRelatedProductBaseDto,
  PaginationQueryDto,
) {}
