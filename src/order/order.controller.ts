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
import { OrderService, OrderFilters } from './order.service';
import type { Order } from './order.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetCurrentUser, type CurrentUser } from '../auth/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: Partial<Order>, @GetCurrentUser() user: CurrentUser) {
    return this.orderService.create(createOrderDto, user.id);
  }

  @Get()
  findAll(
    @GetCurrentUser() user: CurrentUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const filters: OrderFilters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    return this.orderService.findAll(user.id, page, limit, filters);
  }

  @Get('stats')
  getStats(@GetCurrentUser() user: CurrentUser) {
    return this.orderService.getStats(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.orderService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: Partial<Order>, @GetCurrentUser() user: CurrentUser) {
    return this.orderService.update(id, updateOrderDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.orderService.remove(id, user.id);
  }
}
