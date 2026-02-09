'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/orders';
import { OrderStatus, type Order } from '@/lib/types';
import { OrderForm } from '@/components/admin/OrderForm';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';

export default function OrdersListPage() {
  const { data: orders, isLoading, error } = useOrders();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditSuccess = () => {
    setEditingOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Order
              </button>
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {isLoading && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Failed to load orders</p>
          </div>
        )}

        {orders && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Units</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pallets</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assigned User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Priority</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
                        No orders found. Create your first order!
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-mono text-gray-600">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-3 px-4 text-sm">{order.units}</td>
                        <td className="py-3 px-4 text-sm">{order.pallets}</td>
                        <td className="py-3 px-4 text-sm">
                          {order.assignedUser ? order.assignedUser.replace('_', ' ') : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {order.priorityScore || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingOrder(order)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Order"
      >
        <OrderForm onSuccess={handleCreateSuccess} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        title="Edit Order"
      >
        {editingOrder && (
          <OrderForm order={editingOrder} onSuccess={handleEditSuccess} />
        )}
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const statusColors = {
    [OrderStatus.CREATED]: 'bg-gray-100 text-gray-800',
    [OrderStatus.PICKING_PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.PICKING_IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [OrderStatus.PICKED]: 'bg-green-100 text-green-800',
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
