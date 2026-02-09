import axios from 'axios';
import type {
  Order,
  Shipment,
  DashboardSummary,
  ReceivingShipment,
  PutAwayStats,
  PickingOrder,
  AuditStats,
  OutboundShipment,
  CreateOrderDto,
  UpdateOrderDto,
  CreateShipmentDto,
  UpdateShipmentDto,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with interceptor
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed in the future
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardApi = {
  getSummary: () => apiClient.get<DashboardSummary>('/api/dashboard/summary'),
  getReceiving: () => apiClient.get<ReceivingShipment[]>('/api/dashboard/receiving'),
  getPutAway: () => apiClient.get<PutAwayStats>('/api/dashboard/put-away'),
  getPicking: () => apiClient.get<PickingOrder[]>('/api/dashboard/picking'),
  getAudit: () => apiClient.get<AuditStats>('/api/dashboard/audit'),
  getOutbound: () => apiClient.get<OutboundShipment[]>('/api/dashboard/outbound'),
};

// Orders API
export const ordersApi = {
  getAll: () => apiClient.get<Order[]>('/api/orders'),
  getById: (id: string) => apiClient.get<Order>(`/api/orders/${id}`),
  create: (data: CreateOrderDto) => apiClient.post<Order>('/api/orders', data),
  update: (id: string, data: UpdateOrderDto) => apiClient.patch<Order>(`/api/orders/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/orders/${id}`),
};

// Shipments API
export const shipmentsApi = {
  getAll: () => apiClient.get<Shipment[]>('/api/shipments'),
  getById: (id: string) => apiClient.get<Shipment>(`/api/shipments/${id}`),
  create: (data: CreateShipmentDto) => apiClient.post<Shipment>('/api/shipments', data),
  update: (id: string, data: UpdateShipmentDto) => apiClient.patch<Shipment>(`/api/shipments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/shipments/${id}`),
};

// Enums API
export const enumsApi = {
  getOrderStatuses: () => apiClient.get<string[]>('/api/enums/order-statuses'),
  getShipmentStatuses: () => apiClient.get<string[]>('/api/enums/shipment-statuses'),
  getCarriers: () => apiClient.get<string[]>('/api/enums/carriers'),
  getDocks: () => apiClient.get<string[]>('/api/enums/docks'),
  getFlowTypes: () => apiClient.get<string[]>('/api/enums/flow-types'),
  getAssignedUsers: () => apiClient.get<string[]>('/api/enums/assigned-users'),
};
