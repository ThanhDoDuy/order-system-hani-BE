import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    console.log('📊 [DASHBOARD] Get stats request received');
    return this.dashboardService.getDashboardStats();
  }
}
