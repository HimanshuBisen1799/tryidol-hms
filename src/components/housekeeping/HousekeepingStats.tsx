import React from 'react';
import { Home, Clock, CheckCircle, Users } from 'lucide-react';
import { StatCard } from '../shared/StatCard';

export function HousekeepingStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Rooms"
        value="50"
        icon={<Home className="text-blue-600" size={24} />}
        bgColor="bg-blue-100"
      />
      <StatCard
        title="Pending Cleaning"
        value="12"
        icon={<Clock className="text-yellow-600" size={24} />}
        bgColor="bg-yellow-100"
      />
      <StatCard
        title="Clean Rooms"
        value="35"
        icon={<CheckCircle className="text-green-600" size={24} />}
        bgColor="bg-green-100"
      />
      <StatCard
        title="Staff On Duty"
        value="8"
        icon={<Users className="text-purple-600" size={24} />}
        bgColor="bg-purple-100"
      />
    </div>
  );
}