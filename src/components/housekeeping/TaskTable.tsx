import React, { useState, useEffect } from "react";
import { getAllUsersByRole } from "../../services/user.service";
import { HousekeepingService } from "../../services/housekeeping.service";
import { roomService } from "../../services/room.service";

export function TaskTable() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([
    {
      room_number: "",
      bed_number: "",
      task: "cleaning",
      shift: "morning",
      task_status: "pending",
    },
  ]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

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
    } catch (error) {
      setError("Failed to fetch staff details. Please try again later.");
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
    const roomNumber = e.target.value;
    const room = rooms.find((r) => r.room_number === roomNumber);
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], room_number: roomNumber };
    setTasks(updatedTasks);
    setSelectedRoom(room);
  };

  const handleTaskInputChange = (field, value, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        room_number: "",
        bed_number: "",
        task: "cleaning",
        shift: "morning",
        task_status: "pending",
      },
    ]);
  };

  const handleSubmitTask = async () => {
    const data = {
      staff_id: selectedStaff._id,
      tasks: tasks,
    };
    try {
      await HousekeepingService.createHousekeepingTasks(data);
      alert("Tasks assigned successfully!");
      setAddTaskModalOpen(false);
      setTasks([
        {
          room_number: "",
          bed_number: "",
          task: "cleaning",
          shift: "morning",
          task_status: "pending",
        },
      ]);
    } catch (error) {
      console.error("Error creating housekeeping tasks:", error);
      alert("Failed to assign tasks. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Housekeeping Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map((staff) => (
          <div key={staff._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-700">{staff.fullName}</h2>
            <p className="text-sm text-gray-600">Username: {staff.username || "N/A"}</p>
            <p className="text-sm text-gray-600">Email: {staff.email}</p>
            <p className="text-sm text-gray-600">Role: {staff.role}</p>
            <button
              onClick={() => {
                setSelectedStaff(staff);
                setAddTaskModalOpen(true);
              }}
              className="mt-4 w-[40%] mx-2 bg-[#d6e4f6] text-slate-600  py-2 rounded-md hover:bg-[#98b6dd] transition"
            >
              Assign Task
            </button>
            <button
              onClick={() => {
                setSelectedStaff(staff);
                setAddTaskModalOpen(true);
              }}
              className="mt-4 w-[40%]  mx-2  text-slate-600 bg-[#DCFCE7]  py-2 rounded-md hover:bg-[#95c9a7] transition"
            >
              Update Task
            </button>

          </div>
        ))}
      </div>

      {isAddTaskModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              Assign Tasks to {selectedStaff.fullName}
            </h2>
            <div className="space-y-4">
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
                        {rooms.map((room) => (
                          <option key={room._id} value={room.room_number}>
                            {room.room_number}
                          </option>
                        ))}
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
                        {selectedRoom?.beds?.map((bed, bedIndex) => (
                          <option key={bedIndex} value={bed.bed_number}>
                            {bed.bed_number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col w-full md:w-1/3">
                      <label className="block text-sm font-medium text-gray-700">Task</label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={task.task}
                        onChange={(e) =>
                          handleTaskInputChange("task", e.target.value, index)
                        }
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
                        onChange={(e) =>
                          handleTaskInputChange("shift", e.target.value, index)
                        }
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
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setAddTaskModalOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Add Another Task
              </button>
              <button
                onClick={handleSubmitTask}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Submit Tasks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
