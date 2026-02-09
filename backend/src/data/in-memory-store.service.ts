import { Injectable } from '@nestjs/common';
import { Order, Shipment } from '../common/interfaces';
import { v4 as uuid } from 'uuid';

@Injectable()
export class InMemoryStoreService {
  private orders: Map<string, Order> = new Map();
  private shipments: Map<string, Shipment> = new Map();

  // ==================== ORDERS ====================

  createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const order: Order = {
      id: uuid(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(order.id, order);
    return order;
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  updateOrder(id: string, data: Partial<Order>): Order | undefined {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updated: Order = {
      ...order,
      ...data,
      id: order.id, // Ensure ID doesn't change
      createdAt: order.createdAt, // Ensure createdAt doesn't change
      updatedAt: new Date(),
    };
    this.orders.set(id, updated);
    return updated;
  }

  deleteOrder(id: string): boolean {
    return this.orders.delete(id);
  }

  // ==================== SHIPMENTS ====================

  createShipment(
    data: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Shipment {
    const shipment: Shipment = {
      id: uuid(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.shipments.set(shipment.id, shipment);
    return shipment;
  }

  getAllShipments(): Shipment[] {
    return Array.from(this.shipments.values());
  }

  getShipmentById(id: string): Shipment | undefined {
    return this.shipments.get(id);
  }

  updateShipment(
    id: string,
    data: Partial<Shipment>,
  ): Shipment | undefined {
    const shipment = this.shipments.get(id);
    if (!shipment) return undefined;

    const updated: Shipment = {
      ...shipment,
      ...data,
      id: shipment.id, // Ensure ID doesn't change
      createdAt: shipment.createdAt, // Ensure createdAt doesn't change
      updatedAt: new Date(),
    };
    this.shipments.set(id, updated);
    return updated;
  }

  deleteShipment(id: string): boolean {
    return this.shipments.delete(id);
  }

  // ==================== UTILITY ====================

  clearAll(): void {
    this.orders.clear();
    this.shipments.clear();
  }

  getStats() {
    return {
      ordersCount: this.orders.size,
      shipmentsCount: this.shipments.size,
    };
  }
}
