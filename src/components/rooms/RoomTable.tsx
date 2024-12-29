import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { roomService } from '../../services/room.service';
import { Modal } from './Model'; // Ensure Modal is correctly imported

export function RoomTable() {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bedFormVisible, setBedFormVisible] = useState(false); // Show add bed form
  const [bedsToAdd, setBedsToAdd] = useState([{ bed_number: '', status: 'available', price_per_bed: '' }]); // State to track bed form data

  useEffect(() => {
    fetchRooms();
  }, [searchQuery]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await roomService.getAllRooms();
      setRooms(response.rooms);
    } catch (error) {
      setError('Failed to fetch rooms. Please try again later.');
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBedClick = (roomId) => {
    const room = rooms.find(room => room._id === roomId);
    setSelectedRoom(room);
    // This will open the modal for viewing beds
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  // Handle Add Bed Form Visibility
  const handleAddBedClick = (roomId) => {
    const room = rooms.find(room => room._id === roomId);
    setSelectedRoom(room); // Ensure the correct room is selected
    setBedFormVisible(true); // Open the "Add Bed" form
  };

  const handleCloseBedForm = () => {
    setBedFormVisible(false);
    setBedsToAdd([{ bed_number: '', status: 'available', price_per_bed: '' }]); // Reset form
  };

  // Handle input change for adding beds
  const handleBedChange = (index, event) => {
    const { name, value } = event.target;
    const updatedBeds = [...bedsToAdd];
    updatedBeds[index][name] = value;
    setBedsToAdd(updatedBeds);
  };

  const handleAddBedRow = () => {
    setBedsToAdd([...bedsToAdd, { bed_number: '', status: 'available', price_per_bed: '' }]);
  };

  const handleRemoveBedRow = (index) => {
    const updatedBeds = bedsToAdd.filter((_, i) => i !== index);
    setBedsToAdd(updatedBeds);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedRoom) {
      try {
        const response = await roomService.addBedToRoom(selectedRoom.room_number, bedsToAdd);
        console.log('Bed added successfully:', response);
        // Close the form after submission
        handleCloseBedForm();
        fetchRooms(); // Refresh rooms list
      } catch (error) {
        console.error('Error adding beds:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-2  ml-4 mt-3  ">Room Table</h2>
     
      {/* Loading and Error States */}
      {loading && <p className="text-gray-500">Loading rooms...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto my-1">
          <table className="w-full divide-y divide-gray-200 my-2">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Room Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Beds</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Occupied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Maintenance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
             
              {rooms.map((room) => {
              
                const availableBeds = room.beds.filter(bed => bed.status === 'available').length;
                const occupiedBeds = room.beds.filter(bed => bed.status === 'occupied').length;
                const maintenanceBeds = room.beds.filter(bed => bed.status === 'maintenance').length;

                return (
                  <tr key={room._id}>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{room.room_number}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{room.type}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      <button onClick={() => handleBedClick(room._id)} className="text-blue-900  hover:text-blue-900">
                        View Beds
                      </button>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{availableBeds}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{occupiedBeds}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{maintenanceBeds}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 boder">
                    <button
  onClick={() => handleAddBedClick(room._id)}
  className="flex items-center space-x-1 py-2 px-4 border border-blue-400 text-slate-950 rounded-md hover:bg-blue-2 00"
>
  <i className="ri-edit-2-line"></i>
  <span>Add Bed</span>
</button>

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for View Beds */}
      {selectedRoom && !bedFormVisible && (
        <Modal onClose={handleCloseModal}>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Beds in Room {selectedRoom.room_number}</h3>
            <table className="min-w-full divide-y divide-gray-200 my-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Bed Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price per Bed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedRoom.beds.map((bed, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-500">{bed.bed_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{bed.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{bed.price_per_bed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button onClick={handleCloseModal} className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal for Add Bed Form */}
      {bedFormVisible && selectedRoom && (
        <Modal onClose={handleCloseBedForm}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Beds to Room {selectedRoom.room_number}</h3>
              <button onClick={handleCloseBedForm} className="text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full p-1" aria-label="Close Modal">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {bedsToAdd.map((bed, index) => (
                <div key={index} className="mb-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      name="bed_number"
                      value={bed.bed_number}
                      onChange={(e) => handleBedChange(index, e)}
                      placeholder="Bed Number"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                    <select
                      name="status"
                      value={bed.status}
                      onChange={(e) => handleBedChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                    <input
                      type="number"
                      name="price_per_bed"
                      value={bed.price_per_bed}
                      onChange={(e) => handleBedChange(index, e)}
                      placeholder="Price per Bed"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBedRow(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddBedRow}
                className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Another Bed
              </button>
              <div className="mt-4 flex justify-end">
                <button type="submit" className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
