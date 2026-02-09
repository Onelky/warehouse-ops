import { IsEnum, IsInt, IsPositive, IsDateString, IsOptional } from 'class-validator';
import { Carrier, Dock, ShipmentStatus, FlowType } from '../../common/enums';

export class CreateShipmentDto {
  @IsEnum(Carrier)
  carrier: Carrier;

  @IsDateString()
  eta: string;

  @IsOptional()
  @IsDateString()
  actualArrivalTime?: string;

  @IsInt()
  @IsPositive()
  pallets: number;

  @IsEnum(Dock)
  dock: Dock;

  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  @IsEnum(FlowType)
  flowType: FlowType;
}
