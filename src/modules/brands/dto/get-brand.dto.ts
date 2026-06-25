import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetBrandBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by brand name',
    example: 'Square',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class GetBrandDto extends IntersectionType(
  GetBrandBaseDto,
  PaginationQueryDto,
) {}
