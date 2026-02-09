import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('receiving')
  getReceiving() {
    return this.dashboardService.getReceiving();
  }

  @Get('put-away')
  getPutAway() {
    return this.dashboardService.getPutAway();
  }

  @Get('picking')
  getPicking() {
    return this.dashboardService.getPicking();
  }

  @Get('audit')
  getAudit() {
    return this.dashboardService.getAudit();
  }

  @Get('outbound')
  getOutbound() {
    return this.dashboardService.getOutbound();
  }
}
