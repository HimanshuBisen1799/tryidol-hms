import React from 'react';
import { Search, Plus } from 'lucide-react';
import { GuestCard } from './GuestCard';

const guests = [
  {
    initials: 'JD',
    name: 'John Doe',
    type: 'VIP Guest',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    status: 'Currently Staying' as const,
    bgColor: 'bg-blue-100'
  },
  {
    initials: 'AS',
    name: 'Alice Smith',
    type: 'Regular Guest',
    email: 'alice.smith@example.com',
    phone: '+1 987 654 321',
    status: 'Upcoming Stay' as const,
    bgColor: 'bg-purple-100'
  }
];

export function GuestManagement() {
  return (
    <div className="space-y-6  p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Guest Management</h1>
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search guests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div> */}
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            <span>Add Guest</span>
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guests.map((guest) => (
          <GuestCard key={guest.email} {...guest} />
        ))}
      </div>
    </div>
  );
}