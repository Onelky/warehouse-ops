'use client';

import { useState } from 'react';
import { useShipments } from '@/hooks/shipments';
import { ShipmentStatus, type Shipment, type FlowType } from '@/lib/types';
import { ShipmentForm } from '@/components/admin/ShipmentForm';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';

export default function ShipmentsListPage() {
  const { data: shipments, isLoading, error } = useShipments();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);


  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditSuccess = () => {
    setEditingShipment(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Shipment
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
            <p className="text-red-800">Failed to load shipments</p>
          </div>
        )}

        {shipments && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Shipment ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Flow Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Carrier</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pallets</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Dock</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ETA</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
                        No shipments found. Create your first shipment!
                      </td>
                    </tr>
                  ) : (
                    shipments.map((shipment) => (
                      <tr 
                        key={shipment.id} 
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          shipment.isDelayed ? 'bg-red-50' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-sm font-mono text-gray-600">
                          {shipment.id.substring(0, 8)}...
                        </td>
                        <td className="py-3 px-4">
                          <FlowTypeBadge flowType={shipment.flowType} />
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {shipment.isDelayed && <span className="text-red-500 mr-1">⚠️</span>}
                          {shipment.carrier}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={shipment.status} />
                        </td>
                        <td className="py-3 px-4 text-sm">{shipment.pallets}</td>
                        <td className="py-3 px-4 text-sm">{shipment.dock.replace('_', ' ')}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(shipment.eta).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingShipment(shipment)}
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
        title="Create New Shipment"
      >
        <ShipmentForm onSuccess={handleCreateSuccess} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingShipment}
        onClose={() => setEditingShipment(null)}
        title="Edit Shipment"
      >
        {editingShipment && (
          <ShipmentForm shipment={editingShipment} onSuccess={handleEditSuccess} />
        )}
      </Modal>
    </div>
  );
}

function FlowTypeBadge({ flowType }: { flowType: FlowType }) {
  const colors: Record<string, string> = {
    'INBOUND': 'bg-green-100 text-green-800',
    'OUTBOUND': 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[flowType] || 'bg-gray-100 text-gray-800'}`}>
      {flowType}
    </span>
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
    [ShipmentStatus.READY_TO_SHIP]: 'bg-green-100 text-green-800',
    [ShipmentStatus.LOADING]: 'bg-yellow-100 text-yellow-800',
    [ShipmentStatus.CLOSED]: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
