import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelatedProductsService } from './related-products.service';
import { CreateRelatedProductDto } from './dto/create-related-product.dto';
import { UpdateRelatedProductDto } from './dto/update-related-product.dto';

@Controller('related-products')
export class RelatedProductsController {
  constructor(private readonly relatedProductsService: RelatedProductsService) {}

  @Post()
  create(@Body() createRelatedProductDto: CreateRelatedProductDto) {
    return this.relatedProductsService.create(createRelatedProductDto);
  }

  @Get()
  findAll() {
    return this.relatedProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relatedProductsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRelatedProductDto: UpdateRelatedProductDto) {
    return this.relatedProductsService.update(+id, updateRelatedProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relatedProductsService.remove(+id);
  }
}
