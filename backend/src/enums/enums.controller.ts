import { Controller, Get } from '@nestjs/common';
import {
  OrderStatus,
  ShipmentStatus,
  Carrier,
  Dock,
  FlowType,
  AssignedUser,
} from '../common/enums';

/**
 * EnumsController
 *
 * Provides enum values for frontend forms and dropdowns.
 * All endpoints return arrays of string values.
 */
@Controller('enums')
export class EnumsController {
  @Get('order-statuses')
  getOrderStatuses() {
    return Object.values(OrderStatus);
  }

  @Get('shipment-statuses')
  getShipmentStatuses() {
    return Object.values(ShipmentStatus);
  }

  @Get('carriers')
  getCarriers() {
    return Object.values(Carrier);
  }

  @Get('docks')
  getDocks() {
    return Object.values(Dock);
  }

  @Get('flow-types')
  getFlowTypes() {
    return Object.values(FlowType);
  }

  @Get('assigned-users')
  getAssignedUsers() {
    return Object.values(AssignedUser);
  }
}
