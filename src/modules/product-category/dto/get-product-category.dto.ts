import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetProductCategoryBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by team member name (partial match)',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by team member slug (partial match)',
    example: 'john-doe',
  })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class GetProductCategoryDto extends IntersectionType(
  GetProductCategoryBaseDto,
  PaginationQueryDto,
) {}
