import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStoreService } from '../data/in-memory-store.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment, ShipmentWithCalculated } from '../common/interfaces';
import { ShipmentStatus, FlowType, Carrier, Dock } from '../common/enums';
import { ShipmentsGateway } from './shipments.gateway';

/**
 * ShipmentsService
 *
 * Business logic for shipment operations.
 * Provides CRUD operations, filtering capabilities, and calculated fields for shipments.
 * Automatically adds isDelayed field to all shipments based on ETA vs current time.
 */
@Injectable()
export class ShipmentsService {
  constructor(
    private readonly store: InMemoryStoreService,
    private readonly gateway: ShipmentsGateway, 
  ) {}
  /**
   * Create a new shipment
   *
   * @param createShipmentDto - Shipment data to create
   * @returns The created shipment with generated ID and timestamps
   */
  create(createShipmentDto: CreateShipmentDto): Shipment {
    const shipmentData = {
      ...createShipmentDto,
      eta: new Date(createShipmentDto.eta),
      actualArrivalTime: createShipmentDto.actualArrivalTime
        ? new Date(createShipmentDto.actualArrivalTime)
        : undefined,
    };

    const shipment = this.store.createShipment(shipmentData);
    const shipmentWithCalculated = this.addCalculatedFields(shipment);

    this.gateway.emitShipmentCreated(shipmentWithCalculated);
    return shipment;  }

  /**
   * Find shipments with optional filtering
   *
   * @param filters - Optional filters
   * @param filters.status - Filter by single status or array of statuses
   * @param filters.flowType - Filter by flow type (INBOUND/OUTBOUND)
   * @param filters.carrier - Filter by carrier
   * @param filters.dock - Filter by dock
   * @returns Array of shipments matching the filters, with isDelayed calculated field
   */
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

  /**
   * Find a single shipment by ID
   *
   * @param id - Shipment ID
   * @returns The shipment with isDelayed calculated field
   * @throws NotFoundException if shipment not found
   */
  findOne(id: string): ShipmentWithCalculated {
    const shipment = this.store.getShipmentById(id);
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
    return this.addCalculatedFields(shipment);
  }

  /**
   * Update an existing shipment
   *
   * @param id - Shipment ID
   * @param updateShipmentDto - Fields to update
   * @returns The updated shipment with isDelayed calculated field
   * @throws NotFoundException if shipment not found
   */
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

    const shipmentWithCalculated = this.addCalculatedFields(shipment);
    this.gateway.emitShipmentUpdated(shipmentWithCalculated);  // ADD THIS
    return shipmentWithCalculated;
  }

  /**
   * Add calculated fields to a shipment
   * Private helper method
   *
   * @param shipment - Raw shipment data
   * @returns Shipment with isDelayed field calculated
   */
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
