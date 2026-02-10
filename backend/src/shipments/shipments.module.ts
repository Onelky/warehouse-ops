import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { InMemoryStoreService } from '../data/in-memory-store.service';
import { ShipmentsGateway } from './shipments.gateway';

@Module({
  controllers: [ShipmentsController],
  providers: [ShipmentsService, ShipmentsGateway, InMemoryStoreService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
