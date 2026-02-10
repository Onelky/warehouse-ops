'use client';

import { useState } from 'react';
import { useCreateShipment, useUpdateShipment } from '@/hooks/shipments';
import { useShipmentStatuses, useCarriers, useDocks, useFlowTypes } from '@/hooks/useEnums';
import type { Shipment } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ShipmentFormProps {
  shipment?: Shipment;
  onSuccess?: () => void;
}

export function ShipmentForm({ shipment, onSuccess }: ShipmentFormProps) {
  const router = useRouter();
  const createShipment = useCreateShipment();
  const updateShipment = useUpdateShipment();
  
  // Fetch enums from backend
  const { data: shipmentStatuses, isLoading: loadingStatuses } = useShipmentStatuses();
  const { data: carriers, isLoading: loadingCarriers } = useCarriers();
  const { data: docks, isLoading: loadingDocks } = useDocks();
  const { data: flowTypes, isLoading: loadingFlowTypes } = useFlowTypes();

  const [formData, setFormData] = useState({
    carrier: shipment?.carrier || '',
    eta: shipment?.eta ? new Date(shipment.eta).toISOString().slice(0, 16) : '',
    actualArrivalTime: shipment?.actualArrivalTime
      ? new Date(shipment.actualArrivalTime).toISOString().slice(0, 16)
      : '',
    pallets: shipment?.pallets || 0,
    dock: shipment?.dock || '',
    status: shipment?.status || '',
    flowType: shipment?.flowType || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        eta: new Date(formData.eta).toISOString(),
        actualArrivalTime: formData.actualArrivalTime
          ? new Date(formData.actualArrivalTime).toISOString()
          : undefined,
      };

      if (shipment) {
        await updateShipment.mutateAsync({ id: shipment.id, data });
      } else {
        await createShipment.mutateAsync(data);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/shipments');
      }
    } catch (error) {
      console.error('Failed to save shipment:', error);
    }
  };

  const isLoading = createShipment.isPending || updateShipment.isPending;
  const isLoadingEnums = loadingStatuses || loadingCarriers || loadingDocks || loadingFlowTypes;

  if (isLoadingEnums) {
    return (
      <div className="space-y-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Flow Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Flow Type *
        </label>
        <select
          value={formData.flowType}
          onChange={(e) => setFormData({ ...formData, flowType: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select flow type...</option>
          {flowTypes?.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Carrier */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Carrier *
        </label>
        <select
          value={formData.carrier}
          onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select carrier...</option>
          {carriers?.map((carrier) => (
            <option key={carrier} value={carrier}>
              {carrier}
            </option>
          ))}
        </select>
      </div>

      {/* ETA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ETA *
        </label>
        <input
          type="datetime-local"
          value={formData.eta}
          onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Actual arrival time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Actual arrival time (optional)
        </label>
        <input
          type="datetime-local"
          value={formData.actualArrivalTime}
          onChange={(e) =>
            setFormData({ ...formData, actualArrivalTime: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          Set when the shipment actually arrived or left. Required for Summary
          on-time % when status is CLOSED (on-time if ≤ ETA).
        </p>
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

      {/* Dock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dock *
        </label>
        <select
          value={formData.dock}
          onChange={(e) => setFormData({ ...formData, dock: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select dock...</option>
          {docks?.map((dock) => (
            <option key={dock} value={dock}>
              {dock.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

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
          {shipmentStatuses?.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isLoading ? 'Saving...' : shipment ? 'Update Shipment' : 'Create Shipment'}
        </button>
        {!shipment && (
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
