import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetProductBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by product name (partial match)',
    example: 'Napa',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by slug',
    example: 'napa-extra',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Filter by category id',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by generic id',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  generic_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by brand id',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  brand_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by manufacturer',
    example: 'Beximco Pharmaceuticals Ltd.',
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({
    description: 'Prescription required filter',
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  is_prescription_required?: boolean;

  @ApiPropertyOptional({
    description: 'Active status filter',
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  is_active?: boolean;
}

export class GetProductDto extends IntersectionType(
  GetProductBaseDto,
  PaginationQueryDto,
) {}
