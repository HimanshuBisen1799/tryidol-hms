import React from 'react';
import { Download } from 'lucide-react';
import { IndianRupee, Users, Clock, Star } from 'lucide-react';
import { AnalyticsCard } from './AnalyticsCard';

export function ReportsAnalytics() {
  return (
    <div className="space-y-6 mt-7 md:mt-3 lg:mt-3 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          {/* <select className="border border-gray-300 rounded-lg px-4 py-2">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select> */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Revenue"
          value="₹4,25,890"
          change={{ value: "12.5%", timeframe: "from last month", isPositive: true }}
          Icon={IndianRupee}
          bgColor="bg-green-100"
        />
        <AnalyticsCard
          title="Occupancy Rate"
          value="82%"
          change={{ value: "5%", timeframe: "from last week", isPositive: true }}
          Icon={Users}
          bgColor="bg-blue-100"
        />
        <AnalyticsCard
          title="Average Stay"
          value="2.8 Days"
          change={{ value: "0.2 days", timeframe: "from avg", isPositive: true }}
          Icon={Clock}
          bgColor="bg-yellow-100"
        />
        <AnalyticsCard
          title="Customer Satisfaction"
          value="4.8/5"
          change={{ value: "0.2", timeframe: "from last month", isPositive: true }}
          Icon={Star}
          bgColor="bg-purple-100"
        />
      </div>
    </div>
  );
}