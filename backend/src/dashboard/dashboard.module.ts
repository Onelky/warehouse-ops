import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { OrdersModule } from '../orders/orders.module';
import { ShipmentsModule } from '../shipments/shipments.module';


/**
 * DashboardModule
 * 
 * Separate module for dashboard-specific endpoints that aggregate data
 * from multiple sources (Orders and Shipments).
 * 
 * Why separate?
 * - Keeps dashboard logic isolated from CRUD operations
 * - Provides simplified, pre-filtered endpoints for frontend widgets
 * - Centralizes complex calculations (warehouse capacity, on-time %)
 * - Reduces frontend complexity by handling filtering/aggregation server-side
 * 
 * Dependencies:
 * - OrdersModule: For order data and filtering
 * - ShipmentsModule: For shipment data and filtering
 */
@Module({
  imports: [OrdersModule, ShipmentsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
