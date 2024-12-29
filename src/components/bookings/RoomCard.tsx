import React from 'react';

interface RoomCardProps {
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'reserved';
}

export function RoomCard({ number, type, status }: RoomCardProps) {
  const statusColors = {
    available: 'bg-green-100',
    occupied: 'bg-red-100',
    reserved: 'bg-yellow-100'
  };

  return (
    <div className={`${statusColors[status]} p-4 rounded-lg`}>
      <h3 className="font-medium text-gray-900">Room {number}</h3>
      <p className="text-sm text-gray-600">{type}</p>
    </div>
  );
}