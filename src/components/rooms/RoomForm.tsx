import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { roomService, Room, Bed } from '../../services/room.service';

export function RoomForm() {
  const [room, setRoom] = useState<Partial<Room>>({
    room_number: '',
    type: '',
    features: [],
    beds: []
  });
  const [feature, setFeature] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddFeature = () => {
    if (feature.trim()) {
      setRoom(prev => ({
        ...prev,
        features: [...(prev.features || []), feature.trim()]
      }));
      setFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setRoom(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  const handleAddBed = () => {
    const newBed: Bed = {
      bed_number: `${room.beds?.length || 0 + 1}`,
      status: 'available',
      price_per_bed: 0
    };
    setRoom(prev => ({
      ...prev,
      beds: [...(prev.beds || []), newBed]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await roomService.createRoom(room as Room);
      setSuccess('Room created successfully');
      setRoom({
        room_number: '',
        type: '',
        features: [],
        beds: []
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create room');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Room Number</label>
          <input
            type="text"
            value={room.room_number}
            onChange={e => setRoom(prev => ({ ...prev, room_number: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Room Type</label>
          <select
            value={room.type}
            onChange={e => setRoom(prev => ({ ...prev, type: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select type</option>
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Features</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={feature}
              onChange={e => setFeature(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
              placeholder="Add a feature"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {room.features?.map((f, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {f}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Beds</label>
          <button
            type="button"
            onClick={handleAddBed}
            className="mt-1 px-4 py-2 bg-green-50 text-slate-800  border border-green-500 rounded-md hover:bg-green-300"
          >
            Add Bed
          </button>
          <div className="mt-2 space-y-2">
            {room.beds?.map((bed, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  value={bed.bed_number}
                  onChange={e => {
                    const newBeds = [...(room.beds || [])];
                    newBeds[index] = { ...bed, bed_number: e.target.value };
                    setRoom(prev => ({ ...prev, beds: newBeds }));
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Bed number"
                />
                <input
                  type="number"
                  value={bed.price_per_bed}
                  onChange={e => {
                    const newBeds = [...(room.beds || [])];
                    newBeds[index] = { ...bed, price_per_bed: Number(e.target.value) };
                    setRoom(prev => ({ ...prev, beds: newBeds }));
                  }}
                  className="w-32 rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Price"
                />
                <select
                  value={bed.status}
                  onChange={e => {
                    const newBeds = [...(room.beds || [])];
                    newBeds[index] = { ...bed, status: e.target.value as any };
                    setRoom(prev => ({ ...prev, beds: newBeds }));
                  }}
                  className="w-40 rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full  text-xl align-text-bottom text-slate-950 py-2 rounded-lg border border-blue-500 hover:bg-blue-200 outline-4 transition-colors"
        >
          Create Room
        </button>
      </form>
    </div>
  );
}