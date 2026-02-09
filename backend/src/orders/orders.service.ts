import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStoreService } from '../data/in-memory-store.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '../common/interfaces';
import { OrderStatus, AssignedUser } from '../common/enums';

/**
 * OrdersService
 *
 * Business logic for order operations.
 * Provides CRUD operations and filtering capabilities for orders.
 */
@Injectable()
export class OrdersService {
  constructor(private readonly store: InMemoryStoreService) {}

  /**
   * Create a new order
   *
   * @param createOrderDto - Order data to create
   * @returns The created order with generated ID and timestamps
   */
  create(createOrderDto: CreateOrderDto): Order {
    return this.store.createOrder(createOrderDto);
  }

  /**
   * Find orders with optional filtering
   *
   * @param filters - Optional filters
   * @param filters.status - Filter by single status or array of statuses
   * @param filters.assignedUser - Filter by assigned user
   * @returns Array of orders matching the filters
   */
  find(filters?: {
    status?: OrderStatus | OrderStatus[];
    assignedUser?: AssignedUser;
  }): Order[] {
    let orders = this.store.getAllOrders();

    // Apply filters
    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      orders = orders.filter((o) => statuses.includes(o.status));
    }

    if (filters?.assignedUser) {
      orders = orders.filter((o) => o.assignedUser === filters.assignedUser);
    }

    return orders;
  }

  /**
   * Find a single order by ID
   *
   * @param id - Order ID
   * @returns The order
   * @throws NotFoundException if order not found
   */
  findOne(id: string): Order {
    const order = this.store.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  /**
   * Update an existing order
   *
   * @param id - Order ID
   * @param updateOrderDto - Fields to update
   * @returns The updated order
   * @throws NotFoundException if order not found
   */
  update(id: string, updateOrderDto: UpdateOrderDto): Order {
    const order = this.store.updateOrder(id, updateOrderDto);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}
