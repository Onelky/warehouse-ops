import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ShipmentWithCalculated } from '../common/interfaces';

/**
 * ShipmentsGateway
 * 
 * Handles WebSocket events for shipment updates.
 * Broadcasts shipment changes to all connected clients in real-time.
 */
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
})
export class ShipmentsGateway {
  @WebSocketServer()
  server: Server;

  emitShipmentCreated(shipment: ShipmentWithCalculated) {
    this.server.emit('shipment:created', shipment);
  }

  emitShipmentUpdated(shipment: ShipmentWithCalculated) {
    this.server.emit('shipment:updated', shipment);
  }

  emitShipmentDeleted(shipmentId: string) {
    this.server.emit('shipment:deleted', { id: shipmentId });
  }
}