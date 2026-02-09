import { Injectable } from '@nestjs/common';
import { Order, Shipment } from '../common/interfaces';
import { v4 as uuid } from 'uuid';

/**
 * InMemoryStoreService
 *
 * Simple in-memory data storage using JavaScript Maps.
 * Provides CRUD operations for orders and shipments without requiring a database.
 *
 * Note: Data is lost on server restart. This is intentional for the trial project.
 * For production, replace with a database (Prisma + PostgreSQL).
 */
@Injectable()
export class InMemoryStoreService {
  private orders: Map<string, Order> = new Map();
  private shipments: Map<string, Shipment> = new Map();

  // ==================== ORDERS ====================

  /**
   * Create a new order
   *
   * @param data - Order data without id and timestamps
   * @returns Created order with generated ID and timestamps
   */
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

  /**
   * Get all orders
   *
   * @returns Array of all orders
   */
  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  /**
   * Get a single order by ID
   *
   * @param id - Order ID
   * @returns Order or undefined if not found
   */
  getOrderById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  /**
   * Update an existing order
   *
   * @param id - Order ID
   * @param data - Fields to update
   * @returns Updated order or undefined if not found
   */
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

  /**
   * Delete an order
   *
   * @param id - Order ID
   * @returns true if deleted, false if not found
   */
  deleteOrder(id: string): boolean {
    return this.orders.delete(id);
  }

  // ==================== SHIPMENTS ====================

  /**
   * Create a new shipment
   *
   * @param data - Shipment data without id and timestamps
   * @returns Created shipment with generated ID and timestamps
   */
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

  /**
   * Get all shipments
   *
   * @returns Array of all shipments
   */
  getAllShipments(): Shipment[] {
    return Array.from(this.shipments.values());
  }

  /**
   * Get a single shipment by ID
   *
   * @param id - Shipment ID
   * @returns Shipment or undefined if not found
   */
  getShipmentById(id: string): Shipment | undefined {
    return this.shipments.get(id);
  }

  /**
   * Update an existing shipment
   *
   * @param id - Shipment ID
   * @param data - Fields to update
   * @returns Updated shipment or undefined if not found
   */
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

  /**
   * Delete a shipment
   *
   * @param id - Shipment ID
   * @returns true if deleted, false if not found
   */
  deleteShipment(id: string): boolean {
    return this.shipments.delete(id);
  }

  // ==================== UTILITY ====================

  /**
   * Clear all data from the store
   * Useful for testing or resetting the application
   */
  clearAll(): void {
    this.orders.clear();
    this.shipments.clear();
  }

  /**
   * Get statistics about the current data
   *
   * @returns Object with counts of orders and shipments
   */
  getStats() {
    return {
      ordersCount: this.orders.size,
      shipmentsCount: this.shipments.size,
    };
  }
}
