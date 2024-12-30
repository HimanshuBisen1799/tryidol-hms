import React, { useState, useEffect } from "react";
import { getAllUsersByRole } from "../../services/user.service";
import { HousekeepingService } from "../../services/housekeeping.service";
import { roomService } from "../../services/room.service";
import { Calendar } from "lucide-react";

interface Task {
  _id: string;
  room_number: number;
  bed_number: string;
  task: string;
  task_status: string;
  assigned_date: string;
  completion_date?: string;
}

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
  const [staffTasks, setStaffTasks] = useState<Task[]>([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [isViewTaskModalOpen, setViewTaskModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [updateTaskData, setUpdateTaskData] = useState({
    task_status: "pending",
    completion_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchStaffDetails();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedStaff && isViewTaskModalOpen) {
      fetchStaffTasks(selectedStaff._id);
    }
  }, [selectedStaff, isViewTaskModalOpen]);

  const fetchStaffTasks = async (staffId: string) => {
    try {
      const response = await HousekeepingService.getAllHousekeepingTasks(staffId);
      setStaffTasks(response.tasks || []);
    } catch (error) {
      console.error("Error fetching staff tasks:", error);
    }
  };

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

  const handleUpdateTaskStatus = async () => {
    if (!selectedTask) return;

    try {
      await HousekeepingService.updateTaskStatus(selectedTask._id, updateTaskData);
      alert("Task status updated successfully!");
      setUpdateStatusModalOpen(false);
      if (selectedStaff) {
        fetchStaffTasks(selectedStaff._id);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Staff list</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map((staff) => (
          <div key={staff._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-700">{staff.fullName}</h2>
            <p className="text-sm text-gray-600">Username: {staff.username || "N/A"}</p>
            <p className="text-sm text-gray-600">Email: {staff.email}</p>
            <p className="text-sm text-gray-600">Role: {staff.role}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setSelectedStaff(staff);
                  setAddTaskModalOpen(true);
                }}
                className="w-[48%] bg-[#d6e4f6] text-slate-600 py-2 rounded-md hover:bg-[#98b6dd] transition"
              >
                Assign Task
              </button>
              <button
                onClick={() => {
                  setSelectedStaff(staff);
                  setViewTaskModalOpen(true);
                }}
                className="w-[48%] text-slate-600 bg-[#DCFCE7] py-2 rounded-md hover:bg-[#95c9a7] transition"
              >
                View Tasks
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Tasks Modal */}
      {isViewTaskModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-4/5 lg:w-3/4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">
                Tasks for {selectedStaff.fullName}
              </h2>
              <button
                onClick={() => setViewTaskModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffTasks.map((task) => (
                    <tr key={task._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.room_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.bed_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.task}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${task.task_status === 'completed' ? 'bg-green-100 text-green-800' : 
                          task.task_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                          {task.task_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(task.assigned_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setUpdateTaskData({
                              task_status: task.task_status,
                              completion_date: new Date().toISOString().split('T')[0],
                            });
                            setUpdateStatusModalOpen(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isUpdateStatusModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              Update Task Status
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={updateTaskData.task_status}
                  onChange={(e) =>
                    setUpdateTaskData({
                      ...updateTaskData,
                      task_status: e.target.value,
                    })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Completion Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="date"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={updateTaskData.completion_date}
                    onChange={(e) =>
                      setUpdateTaskData({
                        ...updateTaskData,
                        completion_date: e.target.value,
                      })
                    }
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setUpdateStatusModalOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTaskStatus}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700">
                        Room Number
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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

                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700">
                        Bed Number
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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

                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700">
                        Task
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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

                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700">
                        Shift
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setAddTaskModalOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add Another Task
              </button>
              <button
                onClick={handleSubmitTask}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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