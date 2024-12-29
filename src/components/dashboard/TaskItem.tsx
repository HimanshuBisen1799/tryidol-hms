import React from 'react';

interface TaskItemProps {
  title: string;
  details: string;
  priority: 'High' | 'Medium' | 'Urgent';
}

export function TaskItem({ title, details, priority }: TaskItemProps) {
  const priorityStyles = {
    'High': 'bg-yellow-100 text-yellow-800',
    'Medium': 'bg-blue-100 text-blue-800',
    'Urgent': 'bg-red-100 text-red-800'
  };

  return (
    <div className="flex items-start space-x-3 py-4">
      <input type="checkbox" className="mt-1 rounded border-gray-300" />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{details}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm ${priorityStyles[priority]}`}>
        {priority} Priority
      </span>
    </div>
  );
}