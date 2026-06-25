import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Brand name',
    example: 'Square',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

/**
 * Response DTO for Brand entity
 */
export class BrandResponseDto {
  @ApiProperty({
    description: 'UUID of the brand',
  })
  id: string;

  @ApiProperty({
    description: 'Brand name',
  })
  name: string;

  @ApiProperty({
    description: 'Information about the creator',
    required: false,
    type: Object,
  })
  addedBy?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };

  @ApiProperty({
    description: 'Creation timestamp',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updated_at: Date;
}
