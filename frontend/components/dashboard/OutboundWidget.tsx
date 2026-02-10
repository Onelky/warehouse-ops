'use client';

import { useOutbound } from '@/hooks/dashboard';
import { useResponsiveRows } from '@/hooks/useResponsiveRows';
import { OutboundShipment, ShipmentStatus } from '@/lib/types';
import { CarouselTable, TableColumn } from '@/components/ui/CarouselTable';

export function OutboundWidget() {
  const { data, isLoading, error } = useOutbound();
  const rowsPerPage = useResponsiveRows();

  const columns: TableColumn<OutboundShipment>[] = [
    {
      header: 'Carrier',
      dataField: 'carrier',
      render: (value, row) => (
        <div className="flex items-center gap-1">
          {row.isDelayed && <span className="text-red-500 text-xs" title="At Risk">⚠️</span>}
          {value as string}
        </div>
      ),
    },
    {
      header: 'Dock',
      dataField: 'dock',
      render: (value) => (value as string).replace('_', ' '),
    },
    {
      header: 'Pallets',
      dataField: 'pallets',
    },
    {
      header: 'Status',
      dataField: 'status',
      render: (value, row) => <StatusBadge status={value as ShipmentStatus} isDelayed={row.isDelayed} />,
    },
    {
      header: 'ETA',
      dataField: 'eta',
      render: (value) =>
        new Date(value as string).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      className: 'py-2 px-2 text-sm text-gray-600',
    },
  ];

  return (
    <CarouselTable
      title="Outbound"
      columns={columns}
      data={data}
      rowsPerPage={rowsPerPage}
      intervalMs={5000} // 5 seconds for testing (change to 30000 for production)
      isLoading={isLoading}
      error={error}
      emptyMessage="No scheduled outbound shipments"
      getRowKey={(row) => row.id}
      getRowClassName={(row) => (row.isDelayed ? 'bg-red-50' : '')}
    />
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

  const colorClass = isDelayed
    ? 'bg-red-100 text-red-800 border border-red-300'
    : statusColors[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {isDelayed ? 'DELAYED' : status.replace(/_/g, ' ')}
    </span>
  );
}
