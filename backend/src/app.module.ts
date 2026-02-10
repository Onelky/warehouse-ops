import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnumsModule } from './enums/enums.module';
import { DataModule } from './data/data.module';

/**
 * AppModule
 *
 * Root application module that imports all feature modules.
 * DataModule provides the InMemoryStoreService as a global singleton.
 */
@Module({
  imports: [DataModule, OrdersModule, ShipmentsModule, DashboardModule, EnumsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
