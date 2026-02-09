// Enums (kept ONLY for statuses - for type safety and status badge mapping)
// Note: All other values (carriers, docks, users, flow types) are fetched from backend via API
export enum OrderStatus {
  CREATED = 'CREATED',
  PICKING_PENDING = 'PICKING_PENDING',
  PICKING_IN_PROGRESS = 'PICKING_IN_PROGRESS',
  PICKED = 'PICKED',
  AUDIT_PENDING = 'AUDIT_PENDING',
  AUDIT_IN_PROGRESS = 'AUDIT_IN_PROGRESS',
  AUDIT_FAILED = 'AUDIT_FAILED',
  AUDIT_PASSED = 'AUDIT_PASSED',
  SHIPPING_PENDING = 'SHIPPING_PENDING',
  SHIPPING = 'SHIPPING',
  SHIPPED = 'SHIPPED',
  CLOSED = 'CLOSED',
}

export enum ShipmentStatus {
  SCHEDULED = 'SCHEDULED',
  ARRIVED = 'ARRIVED',
  UNLOADING = 'UNLOADING',
  PUT_AWAY_PENDING = 'PUT_AWAY_PENDING',
  PUT_AWAY_IN_PROGRESS = 'PUT_AWAY_IN_PROGRESS',
  STORED = 'STORED',
  READY_TO_SHIP = 'READY_TO_SHIP',
  LOADING = 'LOADING',
  CLOSED = 'CLOSED',
}

// Types for non-status enums (fetched from backend)
export type Carrier = string;
export type Dock = string;
export type FlowType = string;
export type AssignedUser = string;

// Interfaces
export interface Order {
  id: string;
  status: OrderStatus;
  units: number;
  pallets: number;
  assignedUser?: AssignedUser;
  priorityScore?: number;
  healthScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  carrier: Carrier;
  eta: string;
  actualArrivalTime?: string;
  pallets: number;
  dock: Dock;
  status: ShipmentStatus;
  flowType: FlowType;
  createdAt: string;
  updatedAt: string;
  isDelayed?: boolean;
}

// Dashboard DTOs
export interface DashboardSummary {
  totalOrdersToday: number;
  totalUnits: number;
  totalPallets: number;
  onTimePercentage: number;
}

export interface ReceivingShipment {
  id: string;
  carrier: Carrier;
  pallets: number;
  dock: Dock;
  status: ShipmentStatus;
  eta: string;
}

export interface PutAwayStats {
  palletsPending: number;
  palletsInProgress: number;
  availableLocations: number;
  warehouseCapacityPercent: number;
}

export interface PickingOrder {
  id: string;
  assignedUser?: AssignedUser;
  units: number;
  pallets: number;
  priorityScore?: number;
  status: OrderStatus;
}

export interface AuditStats {
  ordersWaiting: number;
  ordersBeingAudited: number;
  passedCount: number;
  failedCount: number;
  passRate: number;
}

export interface OutboundShipment {
  id: string;
  carrier: Carrier;
  dock: Dock;
  status: ShipmentStatus;
  pallets: number;
  eta: string;
  isDelayed: boolean;
}

// Form DTOs
export interface CreateOrderDto {
  status: OrderStatus;
  units: number;
  pallets: number;
  assignedUser?: AssignedUser;
  priorityScore?: number;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  units?: number;
  pallets?: number;
  assignedUser?: AssignedUser;
  priorityScore?: number;
}

export interface CreateShipmentDto {
  carrier: Carrier;
  eta: string;
  pallets: number;
  dock: Dock;
  status: ShipmentStatus;
  flowType: FlowType;
}

export interface UpdateShipmentDto {
  carrier?: Carrier;
  eta?: string;
  pallets?: number;
  dock?: Dock;
  status?: ShipmentStatus;
  flowType?: FlowType;
}
