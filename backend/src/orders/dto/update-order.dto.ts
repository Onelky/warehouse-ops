import { IsEnum, IsInt, IsOptional, IsPositive, Min, Max } from 'class-validator';
import { OrderStatus, AssignedUser } from '../../common/enums';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsInt()
  @IsPositive()
  units?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  pallets?: number;

  @IsOptional()
  @IsEnum(AssignedUser)
  assignedUser?: AssignedUser;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  priorityScore?: number;
}
