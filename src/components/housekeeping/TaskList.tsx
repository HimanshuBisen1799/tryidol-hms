import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Task {
  id: string;
  room: string;
  description: string;
  priority: 'High' | 'Medium';
  status: 'Complete' | 'Pending';
}

const tasks: Task[] = [
  {
    id: '201',
    room: 'Room Cleaning',
    description: 'High Priority • Checkout at 11:00',
    priority: 'High',
    status: 'Complete'
  },
  {
    id: '305',
    room: 'Bed Making',
    description: 'Medium Priority • Regular Service',
    priority: 'Medium',
    status: 'Complete'
  }
];

export function TaskList() {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              {task.id}
            </div>
            <div>
              <h4 className="font-medium">{task.room}</h4>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
          </div>
          <span className="flex items-center text-green-600">
            <CheckCircle2 size={16} className="mr-1" />
            {task.status}
          </span>
        </div>
      ))}
    </div>
  );
}