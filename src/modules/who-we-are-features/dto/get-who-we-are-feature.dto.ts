import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

/**
 * Base DTO for filtering Who We Are features
 */
class GetWWhoWeAreFeatureBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by feature title (partial match)',
    example: 'Our Mission',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by team member designation or role (partial match)',
    example: 'Senior Software Engineer',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

/**
 * DTO for fetching Who We Are entries with pagination
 */
export class GetWWhoWeAreFeatureDto extends IntersectionType(
  GetWWhoWeAreFeatureBaseDto,
  PaginationQueryDto,
) {}
