import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { OrderStatus, ShipmentStatus, FlowType } from '../common/enums';

// Constants
const TOTAL_RACK_CAPACITY = 500; // Total pallets warehouse can hold


/** 
 * Provides aggregated, pre-filtered data for dashboard widgets.
 * Composes data from OrdersService and ShipmentsService to calculate
 * statistics and metrics for real-time dashboard display.
 * 
 * This service handles:
 * - Summary KPIs (total orders, on-time percentage)
 * - Widget-specific data (receiving, picking, put-away, audit, outbound)
 * - Warehouse capacity calculations
 */
@Injectable()
export class DashboardService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly shipmentsService: ShipmentsService,
  ) {}

  /**
   * Get summary metrics for the top KPI bar
   *
   * @returns Object containing:
   * - totalOrdersToday: Count of orders created today
   * - totalUnits: Sum of all units across all orders
   * - totalPallets: Sum of all pallets across all orders
   * - onTimePercentage: Percentage of shipments that arrived on or before ETA
   */
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

  /**
   * Get inbound shipments currently at receiving docks
   *
   * @returns Array of inbound shipments with status SCHEDULED, ARRIVED, or UNLOADING
   * Includes isDelayed calculated field
   */
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

  /**
   * Get put-away statistics and warehouse capacity metrics
   *
   * @returns Object containing:
   * - palletsPending: Total pallets waiting to be put away
   * - palletsInProgress: Total pallets currently being put away
   * - availableLocations: Number of available rack locations
   * - warehouseCapacityPercent: Percentage of warehouse capacity used
   */
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

  /**
   * Get orders currently in picking status
   *
   * @returns Array of orders with status PICKING_PENDING or PICKING_IN_PROGRESS
   */
  getPicking() {
    // Get orders with picking statuses
    return this.ordersService.find({
      status: [OrderStatus.PICKING_PENDING, OrderStatus.PICKING_IN_PROGRESS],
    });
  }

  /**
   * Get audit statistics and pass rate
   *
   * @returns Object containing:
   * - ordersWaiting: Count of orders waiting for audit
   * - ordersBeingAudited: Count of orders currently being audited
   * - passedCount: Count of orders that passed audit
   * - failedCount: Count of orders that failed audit
   * - passRate: Percentage of audited orders that passed
   */
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

    const totalAudited = passedOrders.length + failedOrders.length;
    const passRate = totalAudited > 0 ? (passedOrders.length / totalAudited) * 100 : 100;

    return {
      ordersWaiting: waitingOrders.length,
      ordersBeingAudited: auditingOrders.length,
      passedCount: passedOrders.length,
      failedCount: failedOrders.length,
      passRate: Math.round(passRate * 10) / 10,
    };
  }

  /**
   * Get outbound shipments ready for shipping
   *
   * @returns Array of outbound shipments with status SCHEDULED, READY_TO_SHIP, or LOADING
   * Includes isDelayed calculated field
   */
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
