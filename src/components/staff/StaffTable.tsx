

import React, { useState, useEffect } from "react";
import { getAllUsersByRole } from "../../services/user.service";
import { HousekeepingService } from "../../services/housekeeping.service";
import { roomService } from "../../services/room.service";


export default function StaffTable() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([{
    room_number: "",
    bed_number: "",
    task: "cleaning",
    shift: "morning",
    task_status: "pending",
  }]);
  const [rooms, setRooms] = useState([]);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [staffTotel, setStaffTotel] = useState(Number);

  useEffect(() => {
    fetchStaffDetails();
    fetchRooms();
  }, []);

  const fetchStaffDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsersByRole("staff");
      setStaffMembers(response.data || []);
      setStaffTotel(staffMembers.length);
    } catch (error) {
      setError("Failed to fetch staff details. Please try again later.");
      console.error("Error fetching staff details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAllRooms();
      setRooms(response.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleRoomChange = (e, index) => {
    const selectedRoomNumber = e.target.value;
    const room = rooms.find(room => room.room_number === selectedRoomNumber);
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], room_number: selectedRoomNumber, bed_number: "" };
    setTasks(newTasks);
    setSelectedRoom(room);
  };

  const handleTaskInputChange = (field, value, index) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const handleAssignTask = (staffId) => {
    setSelectedStaffId(staffId);
    setAddTaskModalOpen(true);
  };

  const handleSubmitTask = async () => {
    const data = {
      staff_id: selectedStaffId,
      tasks: tasks,
    };
    try {
      await HousekeepingService.createHousekeepingTasks(data);
      alert("Tasks assigned successfully!");
      setAddTaskModalOpen(false);
      setTasks([{
        room_number: "",
        bed_number: "",
        task: "cleaning",
        shift: "morning",
        task_status: "pending",
      }]);  // Reset tasks to allow new entries
    } catch (error) {
      console.error("Error creating housekeeping tasks:", error);
      alert("Failed to assign tasks. Please try again.");
    }
  };

  const handleAddTask = () => {
    setTasks([...tasks, {
      room_number: "",
      bed_number: "",
      task: "cleaning",
      shift: "morning",
      task_status: "pending",
    }]);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Staff Details</h2>
      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Add</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {staffMembers.map((staff) => (
            <tr key={staff._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.username || "N/A"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.fullName || "N/A"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.email || "N/A"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.role || "N/A"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  className="mt-4 w-[40%] mx-2 bg-[#307de1d5] text-slate-600  py-2 rounded-full hover:bg-[#98b6dd] transition"
                  onClick={() => handleAssignTask(staff._id)}
                >
                 
                 <i class="ri-add-circle-line text-2xl text-white"></i>
                </button>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  className="text-blue-600 hover:text-blue-900 mr-4"
                  onClick={() => handleUpdate(staff._id)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDelete(staff._id)}
                >
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {isAddTaskModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded-md w-5/12  max-w-screen-lg">
      <h2 className="text-lg font-semibold mb-4 text-center">Assign Tasks</h2>
      
      {/* Task Forms Container */}
      <div className="flex flex-wrap gap-4">
        {tasks.map((task, index) => (
         <div
         key={index}
         className="flex-1 border border-gray-300 rounded-md p-4 w-full"
       >
         <h3 className="text-sm font-semibold text-gray-600 mb-4">
           Task {index + 1}
         </h3>
         <div className="flex flex-wrap gap-4">
           <div className="flex flex-col w-full md:w-1/3">
             <label className="block text-sm font-medium text-gray-700">
               Room Number
             </label>
             <select
               className="w-full border rounded-md p-2"
               value={task.room_number}
               onChange={(e) => handleRoomChange(e, index)}
             >
               <option value="">Select Room</option>
               {rooms.length > 0 ? (
                 rooms.map((room) => (
                   <option key={room._id} value={room.room_number}>
                     {room.room_number}
                   </option>
                 ))
               ) : (
                 <option>No rooms available</option>
               )}
             </select>
           </div>
       
           <div className="flex flex-col w-full md:w-1/3">
             <label className="block text-sm font-medium text-gray-700">
               Bed Number
             </label>
             <select
               className="w-full border rounded-md p-2"
               value={task.bed_number}
               onChange={(e) =>
                 handleTaskInputChange("bed_number", e.target.value, index)
               }
               disabled={!selectedRoom}
             >
               <option value="">Select Bed Number</option>
               {selectedRoom && selectedRoom.beds.length > 0 ? (
                 selectedRoom.beds.map((bed, bedIndex) => (
                   <option
                     key={`${selectedRoom._id}-${bedIndex}`}
                     value={bed.bed_number}
                   >
                     {bed.bed_number}
                   </option>
                 ))
               ) : (
                 <option>No beds available</option>
               )}
             </select>
           </div>
       
           <div className="flex flex-col w-full md:w-1/3">
             <label className="block text-sm font-medium text-gray-700">Task</label>
             <select
               className="w-full border rounded-md p-2"
               value={task.task}
               onChange={(e) => handleTaskInputChange("task", e.target.value, index)}
             >
               <option value="cleaning">Cleaning</option>
               <option value="laundry">Laundry</option>
               <option value="maintenance">Maintenance</option>
               <option value="inspection">Inspection</option>
             </select>
           </div>
       
           <div className="flex flex-col w-full md:w-1/3">
             <label className="block text-sm font-medium text-gray-700">Shift</label>
             <select
               className="w-full border rounded-md p-2"
               value={task.shift}
               onChange={(e) => handleTaskInputChange("shift", e.target.value, index)}
             >
               <option value="morning">Morning</option>
               <option value="evening">Evening</option>
               <option value="night">Night</option>
             </select>
           </div>
       
           <div className="flex flex-col w-full md:w-1/3">
             <label className="block text-sm font-medium text-gray-700">
               Task Status
             </label>
             <select
               className="w-full border rounded-md p-2"
               value={task.task_status}
               onChange={(e) =>
                 handleTaskInputChange("task_status", e.target.value, index)
               }
             >
               <option value="pending">Pending</option>
               <option value="in-progress">In Progress</option>
               <option value="completed">Completed</option>
             </select>
           </div>
         </div>
       </div>
         
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-between">
        <button
          className="px-4 py-2 bg-gray-200 rounded-md"
          onClick={() => setAddTaskModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md"
          onClick={handleAddTask}
        >
          Add Another Task
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleSubmitTask}
        >
          Submit All
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
