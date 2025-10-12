import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductService, ProductFilters } from './product.service';
import { Product } from './product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: Partial<Product>) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const filters: ProductFilters = {};
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (search) filters.search = search;
    
    return this.productService.findAll(page, limit, filters);
  }

  @Get('categories')
  getCategories() {
    return this.productService.getCategories();
  }

  @Get('stats')
  getStats() {
    return this.productService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: Partial<Product>) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
