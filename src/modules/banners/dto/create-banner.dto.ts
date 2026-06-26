import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({
    example: 'Summer Sale 50% OFF',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'https://example.com/uploads/banner.jpg',
  })
  @IsUrl()
  image_url: string;

  @ApiProperty({
    example: 'https://example.com/products/summer-sale',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  redirect_url?: string;

  @ApiProperty({
    example: 1,
    description: 'Display order',
  })
  position: number;

  @ApiProperty({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class BannerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty({ required: false })
  redirect_url?: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
