import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

/* ──────────────────────────────────────────────
   CREATE
────────────────────────────────────────────── */
export class CreatePaymentDto {
  @ApiProperty({ description: 'UUID of the order to pay for' })
  @IsUUID()
  order_id: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ description: 'Amount in BDT (must match order total)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @ApiPropertyOptional({
    description: 'Pre-existing transaction ID (COD only)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  transaction_id?: string;
}

/* ──────────────────────────────────────────────
   UPDATE
────────────────────────────────────────────── */
export class UpdatePaymentDto {
  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  transaction_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  failure_reason?: string;
}

/* ──────────────────────────────────────────────
   QUERY
────────────────────────────────────────────── */
export class GetPaymentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  order_id?: string;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  transaction_id?: string;
}

/* ──────────────────────────────────────────────
   RESPONSE
────────────────────────────────────────────── */
export class PaymentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() order_id: string;
  @ApiProperty({ enum: PaymentMethod }) method: PaymentMethod;
  @ApiProperty() amount: number;
  @ApiProperty({ enum: PaymentStatus }) status: PaymentStatus;
  @ApiPropertyOptional() transaction_id?: string;
  @ApiPropertyOptional() paid_at?: Date;
  @ApiProperty() created_at: Date;
}

export class SSLCommerzInitResponseDto {
  @ApiProperty({
    description: 'Redirect the user to this URL to complete payment',
  })
  payment_url: string;

  @ApiProperty({ description: 'Internal payment record ID' })
  payment_id: string;

  @ApiProperty({ description: 'Unique transaction ID for tracking' })
  tran_id: string;
}
