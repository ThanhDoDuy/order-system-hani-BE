import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { Product, ProductDocument } from '../product/product.schema';
import { transformDocument, transformDocuments } from '../utils/transform.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createCategoryDto: Partial<Category>): Promise<Category> {
    const category = new this.categoryModel(createCategoryDto);
    const savedCategory = await category.save();
    
    return transformDocument(savedCategory);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().exec();
    
    // Update product count for each category
    for (const category of categories) {
      const productCount = await this.productModel.countDocuments({ 
        category: category.name 
      }).exec();
      category.productCount = productCount;
    }
    
    return transformDocuments(categories);
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return transformDocument(category);
  }

  async update(id: string, updateCategoryDto: Partial<Category>): Promise<Category> {
    const category = await this.categoryModel.findByIdAndUpdate(
      id, 
      updateCategoryDto, 
      { new: true }
    ).exec();
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return transformDocument(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    // Check if category has products
    const productCount = await this.productModel.countDocuments({ 
      category: category.name 
    }).exec();
    
    if (productCount > 0) {
      throw new Error('Cannot delete category with existing products');
    }
    
    await this.categoryModel.findByIdAndDelete(id).exec();
  }

  async getStats(): Promise<{ totalCategories: number }> {
    const totalCategories = await this.categoryModel.countDocuments().exec();
    return { totalCategories };
  }
}
