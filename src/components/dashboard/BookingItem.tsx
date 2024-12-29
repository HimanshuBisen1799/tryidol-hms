import React from 'react';

interface BookingItemProps {
  initials: string;
  name: string;
  room: string;
  nights: number;
  status: 'check-in' | 'check-out' | 'arriving';
  bgColor?: string;
}

export function BookingItem({ initials, name, room, nights, status, bgColor = 'bg-blue-100' }: BookingItemProps) {
  const statusStyles = {
    'check-in': 'bg-green-100 text-green-800',
    'check-out': 'bg-red-100 text-red-800',
    'arriving': 'bg-yellow-100 text-yellow-800'
  };

  const statusText = {
    'check-in': 'Check-in today',
    'check-out': 'Check-out today',
    'arriving': 'Arriving tomorrow'
  };

  return (
    <div className="flex items-center space-x-4 py-4">
      <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>
        <span className="text-blue-600 font-medium">{initials}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{name}</h4>
        <p className="text-sm text-gray-600">
          {room} • {nights} nights
        </p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    </div>
  );
}