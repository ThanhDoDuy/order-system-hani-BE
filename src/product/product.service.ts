import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { transformDocument, transformDocuments } from '../utils/transform.util';

export interface ProductFilters {
  category?: string;
  status?: string;
  search?: string;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: Partial<Product>): Promise<Product> {
    const product = new this.productModel(createProductDto);
    const savedProduct = await product.save();
    return transformDocument(savedProduct);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: ProductFilters,
  ): Promise<ProductListResponse> {
    const query: any = {};

    if (filters?.category && filters.category !== 'all') {
      query.category = filters.category;
    }

    if (filters?.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { category: { $regex: filters.search, $options: 'i' } },
        { sku: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.productModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(query).exec(),
    ]);

    return {
      data: transformDocuments(data),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product | null> {
    const product = await this.productModel.findById(id).exec();
    return product ? transformDocument(product) : null;
  }

  async update(id: string, updateProductDto: Partial<Product>): Promise<Product | null> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    return product ? transformDocument(product) : null;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async getStats(): Promise<{ totalProducts: number }> {
    const totalProducts = await this.productModel.countDocuments().exec();
    return { totalProducts };
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.productModel.distinct('category').exec();
    return categories;
  }
}
