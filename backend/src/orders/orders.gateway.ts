import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Order } from '../common/interfaces';

/**
 * OrdersGateway
 * 
 * Handles WebSocket events for order updates.
 * Broadcasts order changes to all connected clients in real-time.
 */
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
})
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  /**
   * Broadcast when a new order is created
   */
  emitOrderCreated(order: Order) {
    this.server.emit('order:created', order);
  }

  /**
   * Broadcast when an order is updated
   */
  emitOrderUpdated(order: Order) {
    this.server.emit('order:updated', order);
  }

  /**
   * Broadcast when an order is deleted
   */
  emitOrderDeleted(orderId: string) {
    this.server.emit('order:deleted', { id: orderId });
  }
}