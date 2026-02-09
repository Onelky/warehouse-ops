'use client';

import { useAudit } from '@/hooks/dashboard';

export function AuditWidget() {
  const { data, isLoading, error } = useAudit();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Pre-Ship Audit</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Pre-Ship Audit</h2>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800 text-sm">Failed to load data</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const passRateColor = 
    data.passRate >= 95 ? 'text-green-600' :
    data.passRate >= 85 ? 'text-yellow-600' :
    'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Pre-Ship Audit</h2>
      
      <div className="space-y-4">
        <StatCard
          label="Orders Waiting"
          value={data.ordersWaiting}
          color="yellow"
          icon="⏳"
        />
        
        <StatCard
          label="Being Audited"
          value={data.ordersBeingAudited}
          color="blue"
          icon="🔍"
        />
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-sm text-green-700 font-medium mb-1">Passed</div>
            <div className="text-3xl font-bold text-green-800">{data.passedCount}</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-sm text-red-700 font-medium mb-1">Failed</div>
            <div className="text-3xl font-bold text-red-800">{data.failedCount}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Pass Rate</span>
            <span className={`text-2xl font-bold ${passRateColor}`}>
              {data.passRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${
                data.passRate >= 95 ? 'bg-green-500' :
                data.passRate >= 85 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(data.passRate, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: 'yellow' | 'blue';
  icon: string;
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
