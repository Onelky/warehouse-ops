import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { InMemoryStoreService } from '../data/in-memory-store.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, InMemoryStoreService],
  exports: [OrdersService],
})
export class OrdersModule {}
