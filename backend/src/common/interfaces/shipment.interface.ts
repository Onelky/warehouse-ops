import { Carrier } from '../enums/carrier.enum';
import { Dock } from '../enums/dock.enum';
import { ShipmentStatus } from '../enums/shipment-status.enum';
import { FlowType } from '../enums/flow-type.enum';

export interface Shipment {
  id: string;
  carrier: Carrier;
  eta: Date;
  actualArrivalTime?: Date;
  pallets: number;
  dock: Dock;
  status: ShipmentStatus;
  flowType: FlowType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentWithCalculated extends Shipment {
  isDelayed: boolean;
}
