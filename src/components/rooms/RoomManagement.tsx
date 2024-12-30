import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { RoomForm } from './RoomForm';
import { RoomCard } from '../bookings/RoomCard';
import { roomService, Room, Bed } from '../../services/room.service';
import { RoomTable } from './RoomTable';


export function RoomManagement() {
  const [showForm, setShowForm] = useState(false);

  // Handlers for toggling the form visibility
  const handleAddRoomClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="room-management-container mt-7 md:mt-3 lg:mt-3 p-6 rounded-lg shadow-md" style={{ padding: '1rem' }}>
      {/* Add Room Button */}
      {!showForm && (
        <button
          onClick={handleAddRoomClick}
          
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 2.9rem',
           cursor: 'pointer',
            
          }}
          className="add-room-button ml-3 text-slate-950 border border-blue-400 text-slate-950 rounded-md hover:bg-blue-300"
          
        >
          <Plus size={16} />
          Add Room
        </button>
      )}

      {/* Room Form */}
      {showForm && (
        <div className="room-form-container" style={{ marginTop: '1rem' }}>
          <RoomForm />
          <button
            onClick={handleCloseForm}
            className="close-form-button"
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Close
          </button>
        </div>
      )}

      <RoomTable bookings={roomService.getAllRooms()} />

    </div>
  );
}
