import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStoreService } from '../data/in-memory-store.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment, ShipmentWithCalculated } from '../common/interfaces';
import { ShipmentStatus, FlowType, Carrier, Dock } from '../common/enums';

@Injectable()
export class ShipmentsService {
  constructor(private readonly store: InMemoryStoreService) {}

  create(createShipmentDto: CreateShipmentDto): Shipment {
    const shipmentData = {
      ...createShipmentDto,
      eta: new Date(createShipmentDto.eta),
      actualArrivalTime: createShipmentDto.actualArrivalTime
        ? new Date(createShipmentDto.actualArrivalTime)
        : undefined,
    };
    return this.store.createShipment(shipmentData);
  }

  find(filters?: {
    status?: ShipmentStatus | ShipmentStatus[];
    flowType?: FlowType;
    carrier?: Carrier;
    dock?: Dock;
  }): ShipmentWithCalculated[] {
    let shipments = this.store.getAllShipments();

    // Apply filters
    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      shipments = shipments.filter((s) => statuses.includes(s.status));
    }

    if (filters?.flowType) {
      shipments = shipments.filter((s) => s.flowType === filters.flowType);
    }

    if (filters?.carrier) {
      shipments = shipments.filter((s) => s.carrier === filters.carrier);
    }

    if (filters?.dock) {
      shipments = shipments.filter((s) => s.dock === filters.dock);
    }

    return shipments.map((s) => this.addCalculatedFields(s));
  }

  findOne(id: string): ShipmentWithCalculated {
    const shipment = this.store.getShipmentById(id);
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
    return this.addCalculatedFields(shipment);
  }

  update(id: string, updateShipmentDto: UpdateShipmentDto): ShipmentWithCalculated {
    const updateData = {
      ...updateShipmentDto,
      eta: updateShipmentDto.eta ? new Date(updateShipmentDto.eta) : undefined,
      actualArrivalTime: updateShipmentDto.actualArrivalTime
        ? new Date(updateShipmentDto.actualArrivalTime)
        : undefined,
    };

    const shipment = this.store.updateShipment(id, updateData);
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
    return this.addCalculatedFields(shipment);
  }

  remove(id: string): void {
    const deleted = this.store.deleteShipment(id);
    if (!deleted) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
  }

  // Helper to add calculated fields
  private addCalculatedFields(shipment: Shipment): ShipmentWithCalculated {
    const now = new Date();
    const isDelayed =
      now > shipment.eta && shipment.status !== ShipmentStatus.CLOSED;

    return {
      ...shipment,
      isDelayed,
    };
  }
}
