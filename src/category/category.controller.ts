import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import type { Category } from './category.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetCurrentUser, type CurrentUser } from '../auth/current-user.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: Partial<Category>, @GetCurrentUser() user: CurrentUser) {
    return this.categoryService.create(createCategoryDto, user.id);
  }

  @Get()
  findAll(@GetCurrentUser() user: CurrentUser) {
    return this.categoryService.findAll(user.id);
  }

  @Get('stats')
  getStats(@GetCurrentUser() user: CurrentUser) {
    return this.categoryService.getStats(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.categoryService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: Partial<Category>, @GetCurrentUser() user: CurrentUser) {
    return this.categoryService.update(id, updateCategoryDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.categoryService.remove(id, user.id);
  }
}
