import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum InventoryLogType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
}

export class CreateInventoryLogDto {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  product_variant_id: string;

  @ApiProperty({
    enum: InventoryLogType,
    example: InventoryLogType.SALE,
  })
  @IsEnum(InventoryLogType)
  type: InventoryLogType;

  @ApiProperty({
    example: 5,
  })
  @IsInt()
  quantity: number;

  @ApiProperty({
    example: '7ecbcab3-d847-42ef-a0fb-2d6d8ec2ef7f',
  })
  @IsUUID()
  reference_id: string;

  @ApiProperty({
    example: 'Order placed successfully',
    required: false,
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class InventoryLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product_variant_id: string;

  @ApiProperty({
    enum: InventoryLogType,
  })
  type: InventoryLogType;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  reference_id: string;

  @ApiProperty({
    required: false,
  })
  remarks?: string;

  @ApiProperty()
  created_at: Date;
}
