import { Injectable } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
  ordersTrend: number;
  revenueTrend: number;
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [orderStats, productStats] = await Promise.all([
      this.orderService.getStats(),
      this.productService.getStats(),
    ]);

    return {
      totalOrders: orderStats.totalOrders,
      totalRevenue: orderStats.totalRevenue,
      pendingOrders: orderStats.pendingOrders,
      totalProducts: productStats.totalProducts,
      ordersTrend: orderStats.ordersTrend,
      revenueTrend: orderStats.revenueTrend,
    };
  }
}
