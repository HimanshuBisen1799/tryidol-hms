import React, { useState, useEffect } from "react";
import { getAllUsersByRole,deleteUser } from "../../services/user.service";
import { roomService } from "../../services/room.service";
import { Delete } from "lucide-react";

export default function StaffTable() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchStaffDetails();
    fetchRooms();
  }, [deleteUser]);

  const fetchStaffDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsersByRole("staff");
      setStaffMembers(response.data || []);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // detete seleted user 
  const handleDeleteUser = async (userId) => {
    try {
      const confirmation = window.confirm("Are you sure you want to delete this user?");
      if (!confirmation) return;
  
      if (!userId) {
        alert("Invalid user ID. Cannot proceed.");
        return;
      }
  
      console.log("Calling deleteUser with userId:", userId);
      const result = await deleteUser(userId);
      alert(result?.message || "User deleted successfully");
  
      setStaffMembers((prev) => {
        console.log("Previous staff state:", prev);
        return prev.filter((staff) => staff._id !== userId);
      });
    } catch (error) {
      console.error("Error during user deletion:", error);
      alert(error.message || `Failed to delete user with ID ${userId}`);
    }
  };
  
  
  

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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No.</th>
           <th className = "px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {staffMembers.map((staff) => (
            <tr key={staff._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.username || "N/A"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.fullName || "N/A"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.email || "N/A"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.role || "N/A"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.phone || "N/A"}</td>
              <td className="flex w-[80%] p-1 px-5 items-center align-middle justify-between mt-1">
              <button onClick={() => handleDeleteUser(staff._id)

                
              }>
  <i className="ri-delete-bin-line text-red-600 ml-1 text-xl hover:text-red-800 hover:scale-150"></i>
</button>


                <button>
                <i className="ri-edit-2-line text-blue-600 ml-1 text-xl hover:text-blue-800 hover:scale-150  "></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
