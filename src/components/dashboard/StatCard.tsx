import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  change?: {
    value: string;
    timeframe: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
}

export function StatCard({ title, value, Icon, change, iconBgColor = 'bg-blue-100' }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {change.isPositive ? '+' : ''}{change.value} {change.timeframe}
            </p>
          )}
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <Icon className="text-blue-600" size={24} />
        </div>
      </div>
    </div>
  );
}