'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const response = await dashboardApi.getSummary();
      return response.data;
    },
  });
}

export function useReceiving() {
  return useQuery({
    queryKey: ['dashboard', 'receiving'],
    queryFn: async () => {
      const response = await dashboardApi.getReceiving();
      return response.data;
    },
  });
}

export function usePutAway() {
  return useQuery({
    queryKey: ['dashboard', 'put-away'],
    queryFn: async () => {
      const response = await dashboardApi.getPutAway();
      return response.data;
    },
  });
}

export function usePicking() {
  return useQuery({
    queryKey: ['dashboard', 'picking'],
    queryFn: async () => {
      const response = await dashboardApi.getPicking();
      return response.data;
    },
  });
}

export function useAudit() {
  return useQuery({
    queryKey: ['dashboard', 'audit'],
    queryFn: async () => {
      const response = await dashboardApi.getAudit();
      return response.data;
    },
  });
}

export function useOutbound() {
  return useQuery({
    queryKey: ['dashboard', 'outbound'],
    queryFn: async () => {
      const response = await dashboardApi.getOutbound();
      return response.data;
    },
  });
}
