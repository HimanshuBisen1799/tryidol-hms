import React from 'react';
import { Plus } from 'lucide-react';
import { HousekeepingStats } from './HousekeepingStats';
import { TaskList } from './TaskList';
import { RoomStatus } from './RoomStatus';
import { getAllUsersByRole } from "../../services/user.service";
import { HousekeepingService } from "../../services/housekeeping.service";
import { roomService } from "../../services/room.service";
import{TaskTable} from "./TaskTable";
export function HousekeepingManagement() {
  const rooms = [
    { number: '201', status: 'clean' as const },
    { number: '202', status: 'dirty' as const },
    { number: '203', status: 'in-progress' as const },
    { number: '204', status: 'inspecting' as const }
  ];
  




  return (
    <div className="space-y-6 mt-7 md:mt-3 lg:mt-3 p-6 rounded-lg shadow-md">
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Housekeeping Management-- Upcoming </h1>
        <button className="bg-transparent text-blue-500 border-2 border-blue-100 hover:border-blue-400 md:px-4 md:py-2 px-2 py-1 rounded-lg flex items-center space-x-2  transition-colors">
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <HousekeepingStats />
      
      <TaskTable />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Active Tasks</h2>
          <TaskList />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Room Status</h2>
          <div className="grid grid-cols-2 gap-4">
            {rooms.map((room) => (
              <RoomStatus key={room.number} {...room} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Room Inspection Checklist</h2>
        <div className="space-y-3">
          {[
            'Bed made and linens changed',
            'Bathroom cleaned and sanitized',
            'Floor vacuumed and mopped',
            'Amenities restocked',
            'Windows and mirrors cleaned'
          ].map((item, index) => (
            <label key={index} className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
              <span className="text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}