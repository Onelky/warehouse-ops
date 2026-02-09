'use client';

import { SubmitEventHandler, useState } from 'react';
import { useCreateOrder, useUpdateOrder } from '@/hooks/orders';
import { useOrderStatuses, useAssignedUsers } from '@/hooks/useEnums';
import type { Order } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface OrderFormProps {
  order?: Order;
  onSuccess?: () => void;
}

export function OrderForm({ order, onSuccess }: OrderFormProps) {
  const router = useRouter();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  
  // Fetch enums from backend
  const { data: orderStatuses, isLoading: loadingStatuses } = useOrderStatuses();
  const { data: assignedUsers, isLoading: loadingUsers } = useAssignedUsers();

  const [formData, setFormData] = useState({
    status: order?.status || '',
    units: order?.units || 0,
    pallets: order?.pallets || 0,
    assignedUser: order?.assignedUser || '',
    priorityScore: order?.priorityScore || 50,
  });

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        assignedUser: formData.assignedUser || undefined,
      };

      if (order) {
        await updateOrder.mutateAsync({ id: order.id, data });
      } else {
        await createOrder.mutateAsync(data);
      }

      // TODO: handle this redirection on the hook
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  const isLoading = createOrder.isPending || updateOrder.isPending;
  const isLoadingEnums = loadingStatuses || loadingUsers;

  if (isLoadingEnums) {
    return (
      <div className="space-y-6 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select status...</option>
          {orderStatuses?.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Units */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Units *
        </label>
        <input
          type="number"
          value={formData.units}
          onChange={(e) => setFormData({ ...formData, units: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
          required
        />
      </div>

      {/* Pallets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pallets *
        </label>
        <input
          type="number"
          value={formData.pallets}
          onChange={(e) => setFormData({ ...formData, pallets: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
          required
        />
      </div>

      {/* Assigned User */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assigned User (Optional)
        </label>
        <select
          value={formData.assignedUser}
          onChange={(e) => setFormData({ ...formData, assignedUser: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Unassigned</option>
          {assignedUsers?.map((user) => (
            <option key={user} value={user}>
              {user.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Score */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority Score (0-100)
        </label>
        <input
          type="number"
          value={formData.priorityScore}
          onChange={(e) => setFormData({ ...formData, priorityScore: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
          max="100"
        />
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                formData.priorityScore >= 80 ? 'bg-red-500' :
                formData.priorityScore >= 50 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${formData.priorityScore}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 w-12">{formData.priorityScore}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isLoading ? 'Saving...' : order ? 'Update Order' : 'Create Order'}
        </button>
        {!order && (
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
