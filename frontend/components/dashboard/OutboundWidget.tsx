'use client';

import { useOutbound } from '@/hooks/dashboard';
import { ShipmentStatus } from '@/lib/types';

export function OutboundWidget() {
  const { data, isLoading, error } = useOutbound();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Outbound</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Outbound</h2>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800 text-sm">Failed to load data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Outbound</h2>
      
      {!data || data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No scheduled outbound shipments</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Carrier</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Dock</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Pallets</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">ETA</th>
              </tr>
            </thead>
            <tbody>
              {data.map((shipment) => (
                <tr 
                  key={shipment.id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    shipment.isDelayed ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-sm">
                    <div className="flex items-center gap-2">
                      {shipment.isDelayed && (
                        <span className="text-red-500 font-bold" title="At Risk">⚠️</span>
                      )}
                      {shipment.carrier}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm">{shipment.dock.replace('_', ' ')}</td>
                  <td className="py-3 px-3 text-sm">{shipment.pallets}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={shipment.status} isDelayed={shipment.isDelayed} />
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
      
      {data && data.some(s => s.isDelayed) && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm font-medium">
            ⚠️ {data.filter(s => s.isDelayed).length} shipment(s) at risk
          </p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, isDelayed }: { status: ShipmentStatus; isDelayed: boolean }) {
  const statusColors = {
    [ShipmentStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [ShipmentStatus.READY_TO_SHIP]: 'bg-green-100 text-green-800',
    [ShipmentStatus.LOADING]: 'bg-yellow-100 text-yellow-800',
    [ShipmentStatus.ARRIVED]: 'bg-green-100 text-green-800',
    [ShipmentStatus.UNLOADING]: 'bg-yellow-100 text-yellow-800',
    [ShipmentStatus.PUT_AWAY_PENDING]: 'bg-purple-100 text-purple-800',
    [ShipmentStatus.PUT_AWAY_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
    [ShipmentStatus.STORED]: 'bg-gray-100 text-gray-800',
    [ShipmentStatus.CLOSED]: 'bg-gray-100 text-gray-800',
  };

  const colorClass = isDelayed ? 'bg-red-100 text-red-800 border border-red-300' : statusColors[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {isDelayed ? 'DELAYED' : status.replace(/_/g, ' ')}
    </span>
  );
}
