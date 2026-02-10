'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/hooks/useSocket';
import { SummaryMetrics } from '@/components/dashboard/SummaryMetrics';
import { ReceivingWidget } from '@/components/dashboard/ReceivingWidget';
import { PutAwayWidget } from '@/components/dashboard/PutAwayWidget';
import { PickingWidget } from '@/components/dashboard/PickingWidget';
import { AuditWidget } from '@/components/dashboard/AuditWidget';
import { OutboundWidget } from '@/components/dashboard/OutboundWidget';
import { ConnectionStatus } from '@/components/dashboard/ConnectionStatus';
import Link from 'next/link';

export default function DashboardPage() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Set up real-time updates
  useEffect(() => {
    const handleOrderEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    const handleShipmentEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    };

    const handleDashboardRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    // Subscribe to socket events
    socket.on('order:created', handleOrderEvent);
    socket.on('order:updated', handleOrderEvent);
    socket.on('order:deleted', handleOrderEvent);
    socket.on('shipment:created', handleShipmentEvent);
    socket.on('shipment:updated', handleShipmentEvent);
    socket.on('shipment:deleted', handleShipmentEvent);
    socket.on('dashboard:refresh', handleDashboardRefresh);

    // Cleanup
    return () => {
      socket.off('order:created', handleOrderEvent);
      socket.off('order:updated', handleOrderEvent);
      socket.off('order:deleted', handleOrderEvent);
      socket.off('shipment:created', handleShipmentEvent);
      socket.off('shipment:updated', handleShipmentEvent);
      socket.off('shipment:deleted', handleShipmentEvent);
      socket.off('dashboard:refresh', handleDashboardRefresh);
    };
  }, [socket, queryClient]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Warehouse Operations Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Real-time warehouse activity monitoring</p>
            </div>
            <div className="flex items-center gap-6">
              <ConnectionStatus />
              <Link
                href="/admin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-6 py-4">
        {/* Summary Metrics */}
        <SummaryMetrics />

        {/* Operational Columns - 2 rows of 3 columns each */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Row 1 */}
          <ReceivingWidget />
          <PutAwayWidget />
          <PickingWidget />

          {/* Row 2 */}
          <AuditWidget />
          <OutboundWidget />
          <div className="bg-white rounded-lg shadow p-4 h-[280px] flex items-center justify-center text-gray-400">
            <p className="text-sm">Additional Widget Space</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <p className="text-sm text-gray-500 text-center">
            Warehouse Operations Dashboard - Auto-refreshes in real-time
          </p>
        </div>
      </footer>
    </div>
  );
}
