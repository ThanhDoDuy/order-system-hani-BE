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
import { OrderService, OrderFilters } from './order.service';
import { Order } from './order.schema';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: Partial<Order>) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    console.log('📋 [ORDERS] Get orders request received');
    console.log('📋 [ORDERS] Query params:', { page, limit, status, search });
    
    const filters: OrderFilters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    
    console.log('🔍 [ORDERS] Fetching orders with filters:', filters);
    return this.orderService.findAll(page, limit, filters);
  }

  @Get('stats')
  getStats() {
    return this.orderService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: Partial<Order>) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
