import { InMemoryStoreService } from './in-memory-store.service';
import {
  OrderStatus,
  ShipmentStatus,
  Carrier,
  Dock,
  FlowType,
  AssignedUser,
} from '../common/enums';

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
  const orderStatuses = Object.values(OrderStatus);
  const assignedUsers = Object.values(AssignedUser);

  // Create 80 orders distributed across statuses
  for (let i = 0; i < 30; i++) {
    const status = random(orderStatuses);
    const hasUser = [
      OrderStatus.PICKING_IN_PROGRESS,
      OrderStatus.PICKED,
      OrderStatus.AUDIT_IN_PROGRESS,
    ].includes(status);

    const order = store.createOrder({
      status,
      units: randomInt(10, 500),
      pallets: randomInt(1, 10),
      assignedUser: hasUser ? random(assignedUsers) : undefined,
      priorityScore: randomInt(50, 100),
      healthScore: undefined, // TODO: Calculate later
    });

    // Adjust createdAt to be spread throughout the day
    order.createdAt = hoursAgo(randomInt(0, 12));
    order.updatedAt = order.createdAt;
  }

  // ==================== SEED INBOUND SHIPMENTS ====================
  const carriers = Object.values(Carrier);
  const docks = Object.values(Dock);

  // Create 15 inbound shipments
  const inboundStatuses = [
    ShipmentStatus.SCHEDULED,
    ShipmentStatus.ARRIVED,
    ShipmentStatus.UNLOADING,
    ShipmentStatus.PUT_AWAY_PENDING,
    ShipmentStatus.PUT_AWAY_IN_PROGRESS,
    ShipmentStatus.STORED,
  ];

  for (let i = 0; i < 15; i++) {
    const status = random(inboundStatuses);
    const isArrived = [
      ShipmentStatus.ARRIVED,
      ShipmentStatus.UNLOADING,
      ShipmentStatus.PUT_AWAY_PENDING,
      ShipmentStatus.PUT_AWAY_IN_PROGRESS,
      ShipmentStatus.STORED,
    ].includes(status);

    // Some shipments are delayed (ETA in the past)
    const isDelayed = Math.random() < 0.2; // 20% chance
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

  // ==================== SEED OUTBOUND SHIPMENTS ====================
  const outboundStatuses = [
    ShipmentStatus.SCHEDULED,
    ShipmentStatus.READY_TO_SHIP,
    ShipmentStatus.LOADING,
    ShipmentStatus.CLOSED,
  ];

  for (let i = 0; i < 15; i++) {
    const status = random(outboundStatuses);

    // Some outbound shipments are delayed
    const isDelayed = Math.random() < 0.15; // 15% chance
    const eta = isDelayed ? hoursAgo(randomInt(1, 2)) : hoursFromNow(randomInt(2, 12));

    const shipment = store.createShipment({
      carrier: random(carriers),
      eta,
      actualArrivalTime: undefined, // Outbound doesn't use actualArrivalTime
      pallets: randomInt(3, 20),
      dock: random(docks),
      status,
      flowType: FlowType.OUTBOUND,
    });

    shipment.createdAt = hoursAgo(randomInt(1, 12));
    shipment.updatedAt = shipment.createdAt;
  }

  const stats = store.getStats();
  console.log(`✅ Seeded ${stats.ordersCount} orders and ${stats.shipmentsCount} shipments`);
}
