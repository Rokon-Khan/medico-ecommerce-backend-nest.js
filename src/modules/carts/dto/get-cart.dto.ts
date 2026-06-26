import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetCartBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by User ID',
    example: '8d4c1f0d-0e17-49df-a7e3-43c83f08b2f2',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;
}

export class GetCartDto extends IntersectionType(
  GetCartBaseDto,
  PaginationQueryDto,
) {}
