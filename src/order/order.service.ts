import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { transformDocument, transformDocuments } from '../utils/transform.util';

export interface OrderFilters {
  status?: string;
  search?: string;
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: Partial<Order>, userId: string): Promise<Order> {
    const orderNumber = this.generateOrderNumber();
    const trackingCode = this.generateTrackingCode();
    
    const order = new this.orderModel({
      ...createOrderDto,
      orderNumber,
      trackingCode,
      userId,
    });
    
    const savedOrder = await order.save();
    return transformDocument(savedOrder);
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters?: OrderFilters,
  ): Promise<OrderListResponse> {
    const query: any = { userId };

    if (filters?.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    if (filters?.search) {
      query.$or = [
        { orderNumber: { $regex: filters.search, $options: 'i' } },
        { customerName: { $regex: filters.search, $options: 'i' } },
        { trackingCode: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(query).exec(),
    ]);

    return {
      data: transformDocuments(data),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Order | null> {
    const order = await this.orderModel.findOne({ _id: id, userId }).exec();
    return order ? transformDocument(order) : null;
  }

  async update(id: string, updateOrderDto: Partial<Order>, userId: string): Promise<Order | null> {
    const order = await this.orderModel
      .findOneAndUpdate({ _id: id, userId }, updateOrderDto, { new: true })
      .exec();
    return order ? transformDocument(order) : null;
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const result = await this.orderModel.findOneAndDelete({ _id: id, userId }).exec();
    return !!result;
  }

  async getStats(userId: string): Promise<{
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    ordersTrend: number;
    revenueTrend: number;
  }> {
    const [totalOrders, pendingOrders, totalRevenue] = await Promise.all([
      this.orderModel.countDocuments({ userId }).exec(),
      this.orderModel.countDocuments({ userId, status: { $in: ['new', 'preparing'] } }).exec(),
      this.orderModel.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).exec(),
    ]);

    // Mock trend calculations (in real app, compare with previous period)
    const ordersTrend = 12.5;
    const revenueTrend = 8.3;

    return {
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersTrend,
      revenueTrend,
    };
  }

  private generateOrderNumber(): string {
    return String(Date.now() + Math.floor(Math.random() * 1000));
  }

  private generateTrackingCode(): string {
    return '9400100109361130031' + Date.now();
  }
}
