import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { OrderStatus, ShipmentStatus, FlowType } from '../common/enums';

// Constants
const TOTAL_RACK_CAPACITY = 500; // Total pallets warehouse can hold

@Injectable()
export class DashboardService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly shipmentsService: ShipmentsService,
  ) {}

  getSummary() {
    const orders = this.ordersService.find();
    const shipments = this.shipmentsService.find();

    // Filter orders created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = orders.filter((o) => o.createdAt >= today);

    // Calculate total units and pallets
    const totalUnits = orders.reduce((sum, o) => sum + o.units, 0);
    const totalPallets = orders.reduce((sum, o) => sum + o.pallets, 0);

    // Calculate on-time percentage based on shipments
    const completedShipments = shipments.filter(
      (s) => s.status === ShipmentStatus.CLOSED && s.actualArrivalTime,
    );
    const onTimeShipments = completedShipments.filter(
      (s) => s.actualArrivalTime! <= s.eta,
    );
    const onTimePercentage =
      completedShipments.length > 0
        ? (onTimeShipments.length / completedShipments.length) * 100
        : 100;

    return {
      totalOrdersToday: ordersToday.length,
      totalUnits,
      totalPallets,
      onTimePercentage: Math.round(onTimePercentage * 10) / 10, // Round to 1 decimal
    };
  }

  getReceiving() {
    // Get inbound shipments with receiving statuses
    return this.shipmentsService.find({
      flowType: FlowType.INBOUND,
      status: [
        ShipmentStatus.SCHEDULED,
        ShipmentStatus.ARRIVED,
        ShipmentStatus.UNLOADING,
      ],
    });
  }

  getPutAway() {
    // Get shipments by status
    const pendingShipments = this.shipmentsService.find({
      status: ShipmentStatus.PUT_AWAY_PENDING,
    });
    const inProgressShipments = this.shipmentsService.find({
      status: ShipmentStatus.PUT_AWAY_IN_PROGRESS,
    });
    const storedShipments = this.shipmentsService.find({
      status: ShipmentStatus.STORED,
      flowType: FlowType.INBOUND,
    });

    // Calculate pallets
    const palletsPending = pendingShipments.reduce((sum, s) => sum + s.pallets, 0);
    const palletsInProgress = inProgressShipments.reduce((sum, s) => sum + s.pallets, 0);
    const palletsStored = storedShipments.reduce((sum, s) => sum + s.pallets, 0);

    // Calculate available locations and capacity
    const availableLocations = TOTAL_RACK_CAPACITY - palletsStored;
    const warehouseCapacityPercent = (palletsStored / TOTAL_RACK_CAPACITY) * 100;

    return {
      palletsPending,
      palletsInProgress,
      availableLocations,
      warehouseCapacityPercent: Math.round(warehouseCapacityPercent * 10) / 10,
    };
  }

  getPicking() {
    // Get orders with picking statuses
    return this.ordersService.find({
      status: [OrderStatus.PICKING_PENDING, OrderStatus.PICKING_IN_PROGRESS],
    });
  }

  getAudit() {
    const waitingOrders = this.ordersService.find({
      status: OrderStatus.AUDIT_PENDING,
    });
    const auditingOrders = this.ordersService.find({
      status: OrderStatus.AUDIT_IN_PROGRESS,
    });
    const passedOrders = this.ordersService.find({
      status: OrderStatus.AUDIT_PASSED,
    });
    const failedOrders = this.ordersService.find({
      status: OrderStatus.AUDIT_FAILED,
    });

    const ordersWaiting = waitingOrders.length;
    const ordersBeingAudited = auditingOrders.length;
    const passedCount = passedOrders.length;
    const failedCount = failedOrders.length;

    const totalAudited = passedCount + failedCount;
    const passRate = totalAudited > 0 ? (passedCount / totalAudited) * 100 : 100;

    return {
      ordersWaiting,
      ordersBeingAudited,
      passedCount,
      failedCount,
      passRate: Math.round(passRate * 10) / 10,
    };
  }

  getOutbound() {
    // Get outbound shipments with outbound statuses
    return this.shipmentsService.find({
      flowType: FlowType.OUTBOUND,
      status: [
        ShipmentStatus.SCHEDULED,
        ShipmentStatus.READY_TO_SHIP,
        ShipmentStatus.LOADING,
      ],
    });
  }
}
