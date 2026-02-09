'use client';

import { usePutAway } from '@/hooks/dashboard';

export function PutAwayWidget() {
  const { data, isLoading, error } = usePutAway();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Put Away</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Put Away</h2>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800 text-sm">Failed to load data</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const capacityColor = 
    data.warehouseCapacityPercent >= 90 ? 'text-red-600' :
    data.warehouseCapacityPercent >= 75 ? 'text-yellow-600' :
    'text-green-600';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Put Away</h2>
      
      <div className="space-y-4">
        <StatRow
          label="Pallets Pending"
          value={data.palletsPending}
          color="yellow"
        />
        <StatRow
          label="Pallets In Progress"
          value={data.palletsInProgress}
          color="blue"
        />
        <StatRow
          label="Available Locations"
          value={data.availableLocations}
          color="green"
        />
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Warehouse Capacity</span>
            <span className={`text-2xl font-bold ${capacityColor}`}>
              {data.warehouseCapacityPercent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${
                data.warehouseCapacityPercent >= 90 ? 'bg-red-500' :
                data.warehouseCapacityPercent >= 75 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(data.warehouseCapacityPercent, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: number;
  color: 'yellow' | 'blue' | 'green';
}

function StatRow({ label, value, color }: StatRowProps) {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
  };

  return (
    <div className={`flex justify-between items-center p-4 rounded-lg border ${colorClasses[color]}`}>
      <span className="font-medium">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
