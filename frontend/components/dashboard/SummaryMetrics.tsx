'use client';

import { useDashboardSummary } from '@/hooks/dashboard';

export function SummaryMetrics() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800">Failed to load summary metrics</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <MetricCard
        label="Total Orders (Today)"
        value={data.totalOrdersToday}
        color="blue"
      />
      <MetricCard
        label="Total Units"
        value={data.totalUnits.toLocaleString()}
        color="green"
      />
      <MetricCard
        label="Total Pallets"
        value={data.totalPallets}
        color="purple"
      />
      <MetricCard
        label="On-Time %"
        value={`${data.onTimePercentage.toFixed(1)}%`}
        color={data.onTimePercentage >= 90 ? 'green' : data.onTimePercentage >= 75 ? 'yellow' : 'red'}
      />
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

function MetricCard({ label, value, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    red: 'bg-red-50 border-red-200 text-red-900',
  };

  return (
    <div className={`rounded-lg shadow border-2 p-6 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
