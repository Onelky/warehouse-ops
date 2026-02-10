'use client';

import { usePicking } from '@/hooks/dashboard';
import { OrderStatus } from '@/lib/types';
import { CarouselTable, TableColumn } from '@/components/ui/CarouselTable';

export function PickingWidget() {
  const { data, isLoading, error } = usePicking();

  const columns: TableColumn[] = [
    {
      header: 'Order ID',
      dataField: 'id',
      render: (value) => (
        <span className="font-mono text-gray-600">{value.substring(0, 8)}...</span>
      ),
      className: 'py-2 px-2 text-xs',
    },
    {
      header: 'Picker',
      dataField: 'assignedUser',
      render: (value: string) => (value ? value.replace('_', ' ') : 'Unassigned'),
    },
    {
      header: 'Units',
      dataField: 'units',
    },
    {
      header: 'Pallets',
      dataField: 'pallets',
    },
    {
      header: 'Priority',
      dataField: 'priorityScore',
      render: (value) =>
        value ? <PriorityBadge score={value} /> : <span className="text-gray-400 text-xs">-</span>,
    },
    {
      header: 'Status',
      dataField: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  return (
    <CarouselTable
      title="Picking"
      columns={columns}
      data={data}
      rowsPerPage={5}
      intervalMs={5000} // 5 seconds for testing (change to 30000 for production)
      isLoading={isLoading}
      error={error}
      emptyMessage="No active picking orders"
      getRowKey={(row) => row.id}
    />
  );
}

function PriorityBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-red-100 text-red-800 border-red-200'
      : score >= 50
      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
      : 'bg-green-100 text-green-800 border-green-200';

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
