'use client';

import { useQuery } from '@tanstack/react-query';
import { enumsApi } from '@/lib/api';

export function useOrderStatuses() {
  return useQuery({
    queryKey: ['enums', 'order-statuses'],
    queryFn: async () => {
      const response = await enumsApi.getOrderStatuses();
      return response.data;
    },
    staleTime: Infinity, // Enums rarely change
  });
}

export function useShipmentStatuses() {
  return useQuery({
    queryKey: ['enums', 'shipment-statuses'],
    queryFn: async () => {
      const response = await enumsApi.getShipmentStatuses();
      return response.data;
    },
    staleTime: Infinity,
  });
}

export function useCarriers() {
  return useQuery({
    queryKey: ['enums', 'carriers'],
    queryFn: async () => {
      const response = await enumsApi.getCarriers();
      return response.data;
    },
    staleTime: Infinity,
  });
}

export function useDocks() {
  return useQuery({
    queryKey: ['enums', 'docks'],
    queryFn: async () => {
      const response = await enumsApi.getDocks();
      return response.data;
    },
    staleTime: Infinity,
  });
}

export function useFlowTypes() {
  return useQuery({
    queryKey: ['enums', 'flow-types'],
    queryFn: async () => {
      const response = await enumsApi.getFlowTypes();
      return response.data;
    },
    staleTime: Infinity,
  });
}

export function useAssignedUsers() {
  return useQuery({
    queryKey: ['enums', 'assigned-users'],
    queryFn: async () => {
      const response = await enumsApi.getAssignedUsers();
      return response.data;
    },
    staleTime: Infinity,
  });
}
