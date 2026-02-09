import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnumsModule } from './enums/enums.module';
import { InMemoryStoreService } from './data/in-memory-store.service';

@Module({
  imports: [OrdersModule, ShipmentsModule, DashboardModule, EnumsModule],
  controllers: [AppController],
  providers: [AppService, InMemoryStoreService],
})
export class AppModule {}
