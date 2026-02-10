import { InMemoryStoreService } from './in-memory-store.service';
import {
  OrderStatus,
  ShipmentStatus,
  Carrier,
  Dock,
  FlowType,
  AssignedUser,
} from '../common/enums';

/**
 * Seed the in-memory store with minimal mock data: 5 items per dashboard widget.
 *
 * Generates:
 * - 5 orders for Picking widget (PICKING_PENDING / PICKING_IN_PROGRESS)
 * - 5 orders for Audit widget (AUDIT_PENDING / AUDIT_IN_PROGRESS / AUDIT_PASSED / AUDIT_FAILED)
 * - 5 inbound shipments for Receiving widget (SCHEDULED / ARRIVED / UNLOADING)
 * - 5 inbound shipments for Put Away widget (PUT_AWAY_PENDING / PUT_AWAY_IN_PROGRESS / STORED)
 * - 15 outbound shipments for Outbound widget (SCHEDULED / READY_TO_SHIP / LOADING) for autoscroll
 * - 2 closed outbound + 2 closed inbound shipments with actualArrivalTime for Summary on-time %
 *
 * @param store - InMemoryStoreService instance to populate
 */
export function seedData(store: InMemoryStoreService): void {
  console.log('🌱 Seeding data...');

  const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const hoursAgo = (hours: number): Date => {
    const date = new Date();
    date.setHours(date.getHours() - hours);
    return date;
  };

  const hoursFromNow = (hours: number): Date => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
  };

  const assignedUsers = Object.values(AssignedUser);
  const carriers = Object.values(Carrier);
  const docks = Object.values(Dock);

  // ==================== ORDERS: 5 for Picking + 5 for Audit ====================
  const pickingStatuses = [OrderStatus.PICKING_PENDING, OrderStatus.PICKING_IN_PROGRESS];
  for (let i = 0; i < 5; i++) {
    const status = pickingStatuses[i % 2];
    const order = store.createOrder({
      status,
      units: randomInt(10, 500),
      pallets: randomInt(1, 10),
      assignedUser: status === OrderStatus.PICKING_IN_PROGRESS ? random(assignedUsers) : undefined,
      priorityScore: randomInt(50, 100),
      healthScore: undefined,
    });
    order.createdAt = hoursAgo(randomInt(0, 8));
    order.updatedAt = order.createdAt;
  }

  const auditStatuses = [
    OrderStatus.AUDIT_PENDING,
    OrderStatus.AUDIT_IN_PROGRESS,
    OrderStatus.AUDIT_PASSED,
    OrderStatus.AUDIT_FAILED,
  ];
  for (let i = 0; i < 5; i++) {
    const order = store.createOrder({
      status: auditStatuses[i % 4],
      units: randomInt(10, 500),
      pallets: randomInt(1, 10),
      assignedUser: undefined,
      priorityScore: undefined,
      healthScore: undefined,
    });
    order.createdAt = hoursAgo(randomInt(0, 8));
    order.updatedAt = order.createdAt;
  }

  // ==================== INBOUND: 5 for Receiving + 5 for Put Away ====================
  const receivingStatuses = [
    ShipmentStatus.SCHEDULED,
    ShipmentStatus.ARRIVED,
    ShipmentStatus.UNLOADING,
  ];
  for (let i = 0; i < 5; i++) {
    const status = receivingStatuses[i % 3];
    const isDelayed = i === 0;
    const eta = isDelayed ? hoursAgo(randomInt(1, 2)) : hoursFromNow(randomInt(1, 6));
    const shipment = store.createShipment({
      carrier: random(carriers),
      eta,
      actualArrivalTime: status !== ShipmentStatus.SCHEDULED ? hoursAgo(randomInt(1, 4)) : undefined,
      pallets: randomInt(5, 20),
      dock: random(docks),
      status,
      flowType: FlowType.INBOUND,
    });
    shipment.createdAt = hoursAgo(randomInt(1, 12));
    shipment.updatedAt = shipment.createdAt;
  }

  const putAwayStatuses = [
    ShipmentStatus.PUT_AWAY_PENDING,
    ShipmentStatus.PUT_AWAY_IN_PROGRESS,
    ShipmentStatus.STORED,
  ];
  for (let i = 0; i < 5; i++) {
    const status = putAwayStatuses[i % 3];
    const shipment = store.createShipment({
      carrier: random(carriers),
      eta: hoursAgo(randomInt(2, 8)),
      actualArrivalTime: hoursAgo(randomInt(1, 6)),
      pallets: randomInt(5, 25),
      dock: random(docks),
      status,
      flowType: FlowType.INBOUND,
    });
    shipment.createdAt = hoursAgo(randomInt(2, 24));
    shipment.updatedAt = shipment.createdAt;
  }

  // ==================== OUTBOUND: 15 for widget (autoscroll) + 2 closed for on-time % ====================
  const outboundActiveStatuses = [
    ShipmentStatus.SCHEDULED,
    ShipmentStatus.READY_TO_SHIP,
    ShipmentStatus.LOADING,
  ];
  for (let i = 0; i < 15; i++) {
    const status = outboundActiveStatuses[i % 3];
    const isDelayed = i === 0;
    const eta = isDelayed ? hoursAgo(1) : hoursFromNow(randomInt(2, 10));
    const shipment = store.createShipment({
      carrier: random(carriers),
      eta,
      actualArrivalTime: undefined,
      pallets: randomInt(3, 15),
      dock: random(docks),
      status,
      flowType: FlowType.OUTBOUND,
    });
    shipment.createdAt = hoursAgo(randomInt(1, 8));
    shipment.updatedAt = shipment.createdAt;
  }

  // Closed outbound with actualArrivalTime for Summary on-time % (1 on-time, 1 late)
  // On-time: actualArrivalTime <= eta (actual time is earlier or equal). hoursAgo(3) < hoursAgo(2) in time.
  store.createShipment({
    carrier: random(carriers),
    eta: hoursAgo(2), // ETA was 2 hours ago
    actualArrivalTime: hoursAgo(3), // arrived 3 hours ago → before ETA → on-time
    pallets: randomInt(3, 12),
    dock: random(docks),
    status: ShipmentStatus.CLOSED,
    flowType: FlowType.OUTBOUND,
  });
  store.createShipment({
    carrier: random(carriers),
    eta: hoursAgo(3), // ETA was 3 hours ago
    actualArrivalTime: hoursAgo(0.5), // arrived 0.5 hours ago → after ETA → late
    pallets: randomInt(3, 12),
    dock: random(docks),
    status: ShipmentStatus.CLOSED,
    flowType: FlowType.OUTBOUND,
  });

  // Closed inbound with actualArrivalTime for Summary on-time % (both on-time)
  // On-time: actualArrivalTime <= eta, so actual must be older (larger hoursAgo) than eta
  for (let i = 0; i < 2; i++) {
    const etaHours = randomInt(2, 4);
    const eta = hoursAgo(etaHours);
    const shipment = store.createShipment({
      carrier: random(carriers),
      eta,
      actualArrivalTime: hoursAgo(etaHours + randomInt(1, 2)), // arrived before ETA → on-time
      pallets: randomInt(5, 15),
      dock: random(docks),
      status: ShipmentStatus.CLOSED,
      flowType: FlowType.INBOUND,
    });
    shipment.createdAt = hoursAgo(randomInt(6, 24));
    shipment.updatedAt = shipment.createdAt;
  }

  const stats = store.getStats();
  console.log(`✅ Seeded ${stats.ordersCount} orders and ${stats.shipmentsCount} shipments`);
}
