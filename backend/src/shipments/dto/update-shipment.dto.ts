import { IsEnum, IsInt, IsPositive, IsDateString, IsOptional } from 'class-validator';
import { Carrier, Dock, ShipmentStatus, FlowType } from '../../common/enums';

export class UpdateShipmentDto {
  @IsOptional()
  @IsEnum(Carrier)
  carrier?: Carrier;

  @IsOptional()
  @IsDateString()
  eta?: string;

  @IsOptional()
  @IsDateString()
  actualArrivalTime?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  pallets?: number;

  @IsOptional()
  @IsEnum(Dock)
  dock?: Dock;

  @IsOptional()
  @IsEnum(ShipmentStatus)
  status?: ShipmentStatus;

  @IsOptional()
  @IsEnum(FlowType)
  flowType?: FlowType;
}
