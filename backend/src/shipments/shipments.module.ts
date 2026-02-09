import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { InMemoryStoreService } from '../data/in-memory-store.service';

@Module({
  controllers: [ShipmentsController],
  providers: [ShipmentsService, InMemoryStoreService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
