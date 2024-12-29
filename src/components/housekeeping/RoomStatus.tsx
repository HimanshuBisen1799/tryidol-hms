import React from 'react';

interface RoomStatusProps {
  number: string;
  status: 'clean' | 'dirty' | 'in-progress' | 'inspecting';
}

const statusStyles = {
  'clean': 'bg-green-100 text-green-800',
  'dirty': 'bg-red-100 text-red-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'inspecting': 'bg-blue-100 text-blue-800'
};

const statusText = {
  'clean': 'Clean',
  'dirty': 'Dirty',
  'in-progress': 'In Progress',
  'inspecting': 'Inspecting'
};

export function RoomStatus({ number, status }: RoomStatusProps) {
  return (
    <div className={`${statusStyles[status]} p-4 rounded-lg`}>
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium">Room {number}</span>
        <span className="text-sm">{statusText[status]}</span>
      </div>
    </div>
  );
}