import { PartialType } from '@nestjs/swagger';
import { CreateRelatedProductDto } from './create-related-product.dto';

export class UpdateRelatedProductDto extends PartialType(CreateRelatedProductDto) {}
