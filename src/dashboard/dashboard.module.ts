import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [OrderModule, ProductModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
