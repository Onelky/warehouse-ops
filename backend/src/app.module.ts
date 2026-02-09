import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnumsModule } from './enums/enums.module';
import { InMemoryStoreService } from './data/in-memory-store.service';

/**
 * AppModule
 *
 * Root application module that imports all feature modules.
 * Provides the InMemoryStoreService as a global singleton shared across all modules.
 */
@Module({
  imports: [OrdersModule, ShipmentsModule, DashboardModule, EnumsModule],
  controllers: [],
  providers: [InMemoryStoreService],
})
export class AppModule {}
