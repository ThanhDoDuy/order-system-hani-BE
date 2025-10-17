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
  UseGuards,
} from '@nestjs/common';
import { ProductService, ProductFilters } from './product.service';
import type { Product } from './product.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetCurrentUser, type CurrentUser } from '../auth/current-user.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: Partial<Product>, @GetCurrentUser() user: CurrentUser) {
    return this.productService.create(createProductDto, user.id);
  }

  @Get()
  findAll(
    @GetCurrentUser() user: CurrentUser,
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
    
    return this.productService.findAll(user.id, page, limit, filters);
  }

  @Get('categories')
  getCategories(@GetCurrentUser() user: CurrentUser) {
    return this.productService.getCategories(user.id);
  }

  @Get('stats')
  getStats(@GetCurrentUser() user: CurrentUser) {
    return this.productService.getStats(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.productService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: Partial<Product>, @GetCurrentUser() user: CurrentUser) {
    return this.productService.update(id, updateProductDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.productService.remove(id, user.id);
  }
}
