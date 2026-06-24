import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

/**
 * DTO for creating a WhoWeAre entry
 */
export class CreateWhoWeAreDto {
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

  @ApiProperty({
    description: 'Optional profile image URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description:
      'Optional video URL (e.g., company introduction or profile video)',
    example: 'https://youtube.com/watch?v=xxxxx',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  video_url?: string;
}

/**
 * Response DTO for WhoWeAre entity
 */
export class WhoWeAreResponseDto {
  @ApiProperty({ description: 'UUID of the WhoWeAre entry' })
  id: string;

  @ApiProperty({ description: 'Title or headline' })
  title: string;

  @ApiProperty({ description: 'Detailed description' })
  description: string;

  @ApiProperty({
    description: 'Profile image URL',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Video URL',
    required: false,
  })
  video_url?: string;

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
