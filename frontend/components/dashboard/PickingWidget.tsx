'use client';

import { usePicking } from '@/hooks/dashboard';
import { OrderStatus } from '@/lib/types';

export function PickingWidget() {
  const { data, isLoading, error } = usePicking();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Picking</h2>
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">Picking</h2>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800 text-sm">Failed to load data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 h-[280px] flex flex-col">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Picking</h2>
      
      {!data || data.length === 0 ? (
        <p className="text-gray-500 text-center py-4 text-sm">No active picking orders</p>
      ) : (
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-1 px-2 text-xs font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-1 px-2 text-xs font-semibold text-gray-700">Picker</th>
                <th className="text-left py-1 px-2 text-xs font-semibold text-gray-700">Units</th>
                <th className="text-left py-1 px-2 text-xs font-semibold text-gray-700">Pallets</th>
                <th className="text-left py-1 px-2 text-xs font-semibold text-gray-700">Priority</th>
                <th className="text-left py-1 px-2 text-xs font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-2 text-xs font-mono text-gray-600">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="py-2 px-2 text-sm">
                    {order.assignedUser ? order.assignedUser.replace('_', ' ') : 'Unassigned'}
                  </td>
                  <td className="py-2 px-2 text-sm">{order.units}</td>
                  <td className="py-2 px-2 text-sm">{order.pallets}</td>
                  <td className="py-2 px-2">
                    {order.priorityScore ? (
                      <PriorityBadge score={order.priorityScore} />
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    <StatusBadge status={order.status} />
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

function PriorityBadge({ score }: { score: number }) {
  const color = 
    score >= 80 ? 'bg-red-100 text-red-800 border-red-200' :
    score >= 50 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
    'bg-green-100 text-green-800 border-green-200';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${color}`}>
      {score}
    </span>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const statusColors = {
    [OrderStatus.PICKING_PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.PICKING_IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [OrderStatus.PICKED]: 'bg-green-100 text-green-800',
    [OrderStatus.CREATED]: 'bg-gray-100 text-gray-800',
    [OrderStatus.AUDIT_PENDING]: 'bg-purple-100 text-purple-800',
    [OrderStatus.AUDIT_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
    [OrderStatus.AUDIT_FAILED]: 'bg-red-100 text-red-800',
    [OrderStatus.AUDIT_PASSED]: 'bg-green-100 text-green-800',
    [OrderStatus.SHIPPING_PENDING]: 'bg-blue-100 text-blue-800',
    [OrderStatus.SHIPPING]: 'bg-blue-100 text-blue-800',
    [OrderStatus.SHIPPED]: 'bg-gray-100 text-gray-800',
    [OrderStatus.CLOSED]: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
