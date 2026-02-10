'use client';

import { useReceiving } from '@/hooks/dashboard';
import { useResponsiveRows } from '@/hooks/useResponsiveRows';
import { ShipmentStatus, ReceivingShipment } from '@/lib/types';
import { CarouselTable, TableColumn } from '@/components/ui/CarouselTable';

export function ReceivingWidget() {
  const { data, isLoading, error } = useReceiving();
  const rowsPerPage = useResponsiveRows();

  const columns: TableColumn<ReceivingShipment>[] = [
    {
      header: 'Carrier',
      dataField: 'carrier',
    },
    {
      header: 'Pallets',
      dataField: 'pallets',
    },
    {
      header: 'Dock',
      dataField: 'dock',
      render: (value) => (value as string).replace('_', ' '),
    },
    {
      header: 'Status',
      dataField: 'status',
      render: (value) => <StatusBadge status={value as ShipmentStatus} />,
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
      title="Receiving"
      columns={columns}
      data={data}
      rowsPerPage={rowsPerPage}
      intervalMs={5000} // 5 seconds for testing (change to 30000 for production)
      isLoading={isLoading}
      error={error}
      emptyMessage="No shipments at dock"
      getRowKey={(row) => row.id}
    />
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
