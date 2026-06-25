import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetGenericBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by generic name (partial match)',
    example: 'Paracetamol',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by generic description (partial match)',
    example: 'Pain reliever',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class GetGenericDto extends IntersectionType(
  GetGenericBaseDto,
  PaginationQueryDto,
) {}
