import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { InMemoryStoreService } from '../data/in-memory-store.service';
import { OrdersGateway } from './orders.gateway';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, InMemoryStoreService, OrdersGateway],
  exports: [OrdersService],
})
export class OrdersModule {}
