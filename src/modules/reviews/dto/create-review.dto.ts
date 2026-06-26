import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max, IsString, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 'd3d5c8d4-56ab-4e16-b65c-3b0a3ef5d3d1',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Very effective medicine. Fast delivery.',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class ReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty({
    example: 5,
  })
  rating: number;

  @ApiProperty({
    required: false,
  })
  comment?: string;

  @ApiProperty()
  is_approved: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({
    required: false,
    type: Object,
  })
  user?: {
    id: string;
    name?: string;
    email?: string;
  };

  @ApiProperty({
    required: false,
    type: Object,
  })
  product?: {
    id: string;
    name: string;
    slug: string;
  };
}
