import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: '8d4c1f0d-0e17-49df-a7e3-43c83f08b2f2',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    example: 'Zamirul Kabir',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  full_name: string;

  @ApiProperty({
    example: '01712345678',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    example: 'Dhaka',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  division: string;

  @ApiProperty({
    example: 'Dhaka',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  district: string;

  @ApiProperty({
    example: 'Mirpur-10',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  area: string;

  @ApiProperty({
    example: 'House-10, Road-5, Block-C, Mirpur-10',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'zamirul@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

export class AddressResponseDto {
  @ApiProperty({
    description: 'Address UUID',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
  })
  user_id: string;

  @ApiProperty({
    description: 'Full Name',
  })
  full_name: string;

  @ApiProperty({
    description: 'Phone Number',
  })
  phone: string;

  @ApiProperty({
    description: 'Division',
  })
  division: string;

  @ApiProperty({
    description: 'District',
  })
  district: string;

  @ApiProperty({
    description: 'Area',
  })
  area: string;

  @ApiProperty({
    description: 'Full Address',
  })
  address: string;
  @ApiProperty({
    example: 'zamirul@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Default Address',
  })
  is_default: boolean;

  @ApiProperty({
    description: 'User Information',
    required: false,
    type: Object,
  })
  user?: {
    id: string;
    name?: string;
    email?: string;
  };

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
