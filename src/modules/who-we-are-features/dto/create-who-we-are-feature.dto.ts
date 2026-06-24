import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/**
 * DTO for creating a WhoWeAre feature
 */
export class CreateWhoWeAreFeatureDto {
  @ApiProperty({
    description: 'UUID of the who_we_are',
    example: '1f2c3d4e-5a6b-7c8d-9e10-abcdef123456',
  })
  @IsUUID()
  @IsNotEmpty()
  who_we_are_id: string;

  @ApiProperty({
    description: 'Title or headline for the Who We Are section',
    example:
      'We are a digital agency focused on delivering innovative solutions.',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the Who We Are content',
    example:
      'Senior Software Engineer with expertise in full-stack development.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

/**
 * Response DTO for WhoWeAreFeature entity
 */
export class WhoWeAreFeatureResponseDto {
  @ApiProperty({ description: 'UUID of the WhoWeAreFeature entry' })
  id: string;

  @ApiProperty({ description: 'Category UUID' })
  who_we_are_id: string;

  @ApiProperty({ description: 'Title or headline' })
  title: string;

  @ApiProperty({ description: 'Detailed description' })
  description: string;

  @ApiProperty({
    description: 'Information about the user who added this entry',
    required: false,
    type: Object,
  })
  addedBy?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;

  @ApiProperty({
    description: 'Soft delete timestamp, if the entry is deleted',
    required: false,
    example: '2025-01-01T00:00:00.000Z',
  })
  deleted_at?: Date;
}
