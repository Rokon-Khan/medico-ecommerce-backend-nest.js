import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGenericDto {
  @ApiProperty({
    description: 'Generic medicine name',
    example: 'Paracetamol',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Generic description',
    example: 'Paracetamol is used to treat pain and reduce fever.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

/**
 * Response DTO for Generic entity
 */
export class GenericResponseDto {
  @ApiProperty({
    description: 'UUID of the generic',
  })
  id: string;

  @ApiProperty({
    description: 'Generic medicine name',
  })
  name: string;

  @ApiProperty({
    description: 'Generic description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Information about the staff/admin who created this generic',
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
