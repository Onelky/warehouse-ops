'use client';

import { useReceiving } from '@/hooks/dashboard';
import { ShipmentStatus } from '@/lib/types';

export function ReceivingWidget() {
  const { data, isLoading, error } = useReceiving();

  if (isLoading) {
    return <WidgetSkeleton title="Receiving" />;
  }

  if (error) {
    return <WidgetError title="Receiving" />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Receiving</h2>
      
      {!data || data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No shipments at dock</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Carrier</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Pallets</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Dock</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">ETA</th>
              </tr>
            </thead>
            <tbody>
              {data.map((shipment) => (
                <tr key={shipment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-3 text-sm">{shipment.carrier}</td>
                  <td className="py-3 px-3 text-sm">{shipment.pallets}</td>
                  <td className="py-3 px-3 text-sm">{shipment.dock.replace('_', ' ')}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={shipment.status} />
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-600">
                    {new Date(shipment.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ShipmentStatus }) {
  const statusColors = {
    [ShipmentStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [ShipmentStatus.ARRIVED]: 'bg-green-100 text-green-800',
    [ShipmentStatus.UNLOADING]: 'bg-yellow-100 text-yellow-800',
    [ShipmentStatus.PUT_AWAY_PENDING]: 'bg-purple-100 text-purple-800',
    [ShipmentStatus.PUT_AWAY_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
    [ShipmentStatus.STORED]: 'bg-gray-100 text-gray-800',
    [ShipmentStatus.READY_TO_SHIP]: 'bg-blue-100 text-blue-800',
    [ShipmentStatus.LOADING]: 'bg-yellow-100 text-yellow-800',
    [ShipmentStatus.CLOSED]: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function WidgetSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="animate-pulse space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}

function WidgetError({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-800 text-sm">Failed to load data</p>
      </div>
    </div>
  );
}
