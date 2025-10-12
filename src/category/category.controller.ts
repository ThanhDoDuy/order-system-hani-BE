import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.schema';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: Partial<Category>) {
    console.log('🏷️ [CATEGORIES] Create category request received');
    console.log('📦 [CATEGORIES] Request body:', createCategoryDto);
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    console.log('🏷️ [CATEGORIES] Get all categories request received');
    return this.categoryService.findAll();
  }

  @Get('stats')
  getStats() {
    console.log('📊 [CATEGORIES] Get stats request received');
    return this.categoryService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('🔍 [CATEGORIES] Get category by ID request received:', id);
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: Partial<Category>) {
    console.log('✏️ [CATEGORIES] Update category request received:', id);
    console.log('📦 [CATEGORIES] Update data:', updateCategoryDto);
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('🗑️ [CATEGORIES] Delete category request received:', id);
    return this.categoryService.remove(id);
  }
}
