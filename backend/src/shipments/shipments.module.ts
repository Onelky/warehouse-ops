import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsGateway } from './shipments.gateway';

/**
 * ShipmentsModule
 *
 * Handles all shipment-related operations (CRUD).
 */
@Module({
  controllers: [ShipmentsController],
  providers: [ShipmentsService, ShipmentsGateway],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
