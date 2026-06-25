import { Injectable } from '@nestjs/common';
import { CreateRelatedProductDto } from './dto/create-related-product.dto';
import { UpdateRelatedProductDto } from './dto/update-related-product.dto';

@Injectable()
export class RelatedProductsService {
  create(createRelatedProductDto: CreateRelatedProductDto) {
    return 'This action adds a new relatedProduct';
  }

  findAll() {
    return `This action returns all relatedProducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relatedProduct`;
  }

  update(id: number, updateRelatedProductDto: UpdateRelatedProductDto) {
    return `This action updates a #${id} relatedProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} relatedProduct`;
  }
}
