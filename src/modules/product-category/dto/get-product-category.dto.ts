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
}

export class GetProductCategoryDto extends IntersectionType(
  GetProductCategoryBaseDto,
  PaginationQueryDto,
) {}
