import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    example: '8d4c1f0d-0e17-49df-a7e3-43c83f08b2f2',
  })
  @IsUUID()
  user_id: string;
}

export class CartResponseDto {
  @ApiProperty({
    description: 'Cart UUID',
  })
  id: string;

  @ApiProperty({
    description: 'User UUID',
  })
  user_id: string;

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

  @ApiProperty({
    description: 'Created At',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Updated At',
  })
  updated_at: Date;
}
