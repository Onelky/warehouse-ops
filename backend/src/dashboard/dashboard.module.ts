import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { OrdersModule } from '../orders/orders.module';
import { ShipmentsModule } from '../shipments/shipments.module';

@Module({
  imports: [OrdersModule, ShipmentsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
