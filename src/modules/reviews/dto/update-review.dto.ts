// src/reviews/dto/update-review.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({
    example: 'Updated review: Works great!',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
