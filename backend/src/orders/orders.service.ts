import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStoreService } from '../data/in-memory-store.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '../common/interfaces';
import { OrderStatus, AssignedUser } from '../common/enums';

@Injectable()
export class OrdersService {
  constructor(private readonly store: InMemoryStoreService) {}

  create(createOrderDto: CreateOrderDto): Order {
    return this.store.createOrder(createOrderDto);
  }

  find(filters?: {
    status?: OrderStatus;
    assignedUser?: AssignedUser;
  }): Order[] {
    let orders = this.store.getAllOrders();

    // Apply filters. For now,  
    if (filters?.status) {
      orders = orders.filter((o) => o.status === filters.status);
    }

    if (filters?.assignedUser) {
      orders = orders.filter((o) => o.assignedUser === filters.assignedUser);
    }

    return orders;
  }

  findOne(id: string): Order {
    const order = this.store.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  update(id: string, updateOrderDto: UpdateOrderDto): Order {
    const order = this.store.updateOrder(id, updateOrderDto);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}
