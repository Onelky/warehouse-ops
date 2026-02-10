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
 * Seed the in-memory store with realistic mock data
 *
 * Generates:
 * - 80 orders (varied distribution across 12 statuses)
 * - 30 inbound shipments (5 per status, 6 statuses)
 * - 20 outbound shipments (5 per status, 4 statuses)
 * - Realistic timestamps spread throughout the day
 * - One delayed shipment per status for testing
 *
 * Distribution focuses on active workflow stages:
 * - More orders in PICKING_PENDING (12) and AUDIT_PASSED (15)
 * - Fewer in transitional states like AUDIT_IN_PROGRESS (3)
 *
 * @param store - InMemoryStoreService instance to populate
 */
export function seedData(store: InMemoryStoreService): void {
  console.log('🌱 Seeding data...');

  // Helper to get random element from array
  const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // Helper to get random number in range
  const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Helper to get date offset by hours
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

  // ==================== SEED ORDERS ====================
  const assignedUsers = Object.values(AssignedUser);

  // Create varied number of orders per status for realistic distribution
  const orderStatusCounts = [
    { status: OrderStatus.CREATED, count: 8 },
    { status: OrderStatus.PICKING_PENDING, count: 12 },
    { status: OrderStatus.PICKING_IN_PROGRESS, count: 7 },
    { status: OrderStatus.PICKED, count: 5 },
    { status: OrderStatus.AUDIT_PENDING, count: 6 },
    { status: OrderStatus.AUDIT_IN_PROGRESS, count: 3 },
    { status: OrderStatus.AUDIT_PASSED, count: 15 },
    { status: OrderStatus.AUDIT_FAILED, count: 2 },
    { status: OrderStatus.SHIPPING_PENDING, count: 4 },
    { status: OrderStatus.SHIPPING, count: 3 },
    { status: OrderStatus.SHIPPED, count: 10 },
    { status: OrderStatus.CLOSED, count: 5 },
  ];

  orderStatusCounts.forEach(({ status, count }) => {
    for (let i = 0; i < count; i++) {
      const hasUser = [
        OrderStatus.PICKING_IN_PROGRESS,
        OrderStatus.PICKED,
        OrderStatus.AUDIT_IN_PROGRESS,
      ].includes(status);

      // Create timestamp spread throughout today (0-12 hours ago)
      const createdAt = hoursAgo(randomInt(0, 12));

      const order = store.createOrder({
        status,
        units: randomInt(10, 500),
        pallets: randomInt(1, 10),
        assignedUser: hasUser ? random(assignedUsers) : undefined,
        priorityScore: randomInt(50, 100),
        healthScore: undefined,
      });

      // Override timestamps to be within today
      order.createdAt = createdAt;
      order.updatedAt = createdAt;
    }
  });

  // ==================== SEED INBOUND SHIPMENTS ====================
  const carriers = Object.values(Carrier);
  const docks = Object.values(Dock);

  // Create 5 inbound shipments for each status (6 statuses × 5 = 30 shipments)
  const inboundStatuses = [
    ShipmentStatus.SCHEDULED,
    ShipmentStatus.ARRIVED,
    ShipmentStatus.UNLOADING,
    ShipmentStatus.PUT_AWAY_PENDING,
    ShipmentStatus.PUT_AWAY_IN_PROGRESS,
    ShipmentStatus.STORED,
  ];

  inboundStatuses.forEach((status) => {
    for (let i = 0; i < 5; i++) {
      const isArrived = [
        ShipmentStatus.ARRIVED,
        ShipmentStatus.UNLOADING,
        ShipmentStatus.PUT_AWAY_PENDING,
        ShipmentStatus.PUT_AWAY_IN_PROGRESS,
        ShipmentStatus.STORED,
      ].includes(status);

      // First one of each status is delayed
      const isDelayed = i === 0;
      const eta = isDelayed ? hoursAgo(randomInt(1, 3)) : hoursFromNow(randomInt(1, 8));

      const shipment = store.createShipment({
        carrier: random(carriers),
        eta,
        actualArrivalTime: isArrived ? hoursAgo(randomInt(1, 6)) : undefined,
        pallets: randomInt(5, 30),
        dock: random(docks),
        status,
        flowType: FlowType.INBOUND,
      });

      shipment.createdAt = hoursAgo(randomInt(2, 24));
      shipment.updatedAt = shipment.createdAt;
    }
  });

  // ==================== SEED OUTBOUND SHIPMENTS ====================
  // Create 5 outbound shipments for each status (4 statuses × 5 = 20 shipments)
  const outboundStatuses = [
    ShipmentStatus.SCHEDULED,
    ShipmentStatus.READY_TO_SHIP,
    ShipmentStatus.LOADING,
    ShipmentStatus.CLOSED,
  ];

  outboundStatuses.forEach((status) => {
    for (let i = 0; i < 5; i++) {
      // First one of each status is delayed
      const isDelayed = i === 0;
      const eta = isDelayed ? hoursAgo(randomInt(1, 2)) : hoursFromNow(randomInt(2, 12));

      const shipment = store.createShipment({
        carrier: random(carriers),
        eta,
        actualArrivalTime: undefined,
        pallets: randomInt(3, 20),
        dock: random(docks),
        status,
        flowType: FlowType.OUTBOUND,
      });

      shipment.createdAt = hoursAgo(randomInt(1, 12));
      shipment.updatedAt = shipment.createdAt;
    }
  });

  const stats = store.getStats();
  console.log(`✅ Seeded ${stats.ordersCount} orders and ${stats.shipmentsCount} shipments`);
}
