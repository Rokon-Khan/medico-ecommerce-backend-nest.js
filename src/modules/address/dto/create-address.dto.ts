// create-address.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  division?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zip?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

// ✅ Add AddressResponseDto here
// create-address.dto.ts
export class AddressResponseDto {
  id: string;
  user_id: string;
  full_name: string; // Make sure this is string, not optional
  phone: string;
  email: string;
  division: string;
  district: string;
  area: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  address: string;
  is_default: boolean;
  user?: {
    id: string;
    name: string; // Make sure this is string, not optional
    email: string;
  };
  created_at: Date;
  updated_at: Date;
}
