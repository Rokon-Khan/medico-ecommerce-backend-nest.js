// src/modules/product-search/product-search.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductSearchService } from './product-search.service';
import { ProductSearchDto } from './dto/create-product-search.dto';

@ApiTags('Product Search')
@Controller('products') // ✅ Changed to 'products' for better API design
export class ProductSearchController {
  constructor(private readonly productSearchService: ProductSearchService) {}

  /**
   * ✅ Advanced Search with Filters
   */
  @ApiOperation({ summary: 'Search products with advanced filters' })
  @Get('search')
  search(@Query() dto: ProductSearchDto) {
    return this.productSearchService.searchProducts(dto);
  }

  /**
   * ✅ Get filter options for frontend
   */
  @ApiOperation({ summary: 'Get all filter options for frontend' })
  @Get('filters')
  getFilterOptions() {
    return this.productSearchService.getFilterOptions();
  }

  /**
   * ✅ Autocomplete suggestions
   */
  @ApiOperation({ summary: 'Get autocomplete suggestions' })
  @Get('autocomplete')
  autocomplete(
    @Query('search') search: string,
    @Query('limit') limit?: string,
  ) {
    return this.productSearchService.autocomplete(
      search,
      limit ? parseInt(limit) : 10,
    );
  }

  /**
   * ✅ Get similar products
   */
  @ApiOperation({ summary: 'Get similar products' })
  @Get(':id/similar')
  getSimilarProducts(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: string,
  ) {
    return this.productSearchService.getSimilarProducts(
      id,
      limit ? parseInt(limit) : 10,
    );
  }
}
