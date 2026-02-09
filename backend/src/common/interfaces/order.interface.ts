import { OrderStatus } from '../enums/order-status.enum';
import { AssignedUser } from '../enums/assigned-user.enum';

export interface Order {
  id: string;
  status: OrderStatus;
  units: number;
  pallets: number;
  assignedUser?: AssignedUser;
  priorityScore?: number;
  healthScore?: number; // TODO: Define calculation formula later
  createdAt: Date;
  updatedAt: Date;
}
