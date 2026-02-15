
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend !== undefined && (
          <div className={`flex items-center mt-2 text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            <span className="mr-1">{trend >= 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend)}% from last week</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  );
};
