import React from 'react';
import { Mail, Phone, MoreVertical } from 'lucide-react';

interface GuestCardProps {
  initials: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  status: 'Currently Staying' | 'Upcoming Stay';
  bgColor?: string;
}

export function GuestCard({ initials, name, type, email, phone, status, bgColor = 'bg-blue-100' }: GuestCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
            <span className="text-lg font-medium text-blue-600">{initials}</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{type}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Mail size={16} className="mr-2" />
          {email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone size={16} className="mr-2" />
          {phone}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm ${
          status === 'Currently Staying' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {status}
        </span>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View Profile
        </button>
      </div>
    </div>
  );
}