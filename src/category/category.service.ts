import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createCategoryDto: Partial<Category>, userId: string): Promise<Category> {
    try {
      const category = new this.categoryModel({
        ...createCategoryDto,
        userId,
      });
      const savedCategory = await category.save();
      return transformDocument(savedCategory);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Category "${createCategoryDto.name}" already exists for this user`);
      }
      throw error;
    }
  }


  async findAll(userId: string): Promise<Category[]> {
    const categories = await this.categoryModel.find({ userId }).exec();
    
    // Update product count for each category
    for (const category of categories) {
      const productCount = await this.productModel.countDocuments({ 
        category: category.name,
        userId,
      }).exec();
      category.productCount = productCount;
    }
    
    return transformDocuments(categories);
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id: id, userId }).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return transformDocument(category);
  }

  async update(id: string, updateCategoryDto: Partial<Category>, userId: string): Promise<Category> {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: id, userId }, 
      updateCategoryDto, 
      { new: true }
    ).exec();
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return transformDocument(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.categoryModel.findOne({ _id: id, userId }).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    // Check if category has products
    const productCount = await this.productModel.countDocuments({ 
      category: category.name,
      userId,
    }).exec();
    
    if (productCount > 0) {
      throw new Error('Cannot delete category with existing products');
    }
    
    await this.categoryModel.findOneAndDelete({ _id: id, userId }).exec();
  }

  async getStats(userId: string): Promise<{ totalCategories: number }> {
    const totalCategories = await this.categoryModel.countDocuments({ userId }).exec();
    return { totalCategories };
  }
}
