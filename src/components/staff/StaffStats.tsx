import React, { useState, useEffect } from "react";
import { Users, CheckCircle, ClipboardList, TrendingUp } from "lucide-react";
import { getAllUsersByRole } from "../../services/user.service";
import { roomService } from "../../services/room.service";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
}

function StatCard({ title, value, subtitle, icon, bgColor }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold mt-2">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}

export function StaffStats() {
  const [staffTotal, setStaffTotal] = useState<number>(0);
  const [roomTotal, setRoomTotal] = useState<number>(0);

  useEffect(() => {
    fetchStaffDetails();
    fetchRooms();
  }, []);

  const fetchStaffDetails = async () => {
    try {
      const response = await getAllUsersByRole("staff");
      setStaffTotal(response.data.length);
    } catch (error) {
      console.error("Error fetching staff details:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAllRooms();
      setRoomTotal(response.rooms.length);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Staff"
        value={staffTotal}
        subtitle="Full Strength"
        icon={<Users className="text-blue-600" size={24} />}
        bgColor="bg-blue-100"
      />
      <StatCard
        title="Total Rooms"
        value={roomTotal}
        subtitle="Available Rooms"
        icon={<CheckCircle className="text-green-600" size={24} />}
        bgColor="bg-green-100"
      />
      <StatCard
        title="Tasks Assigned"
        value="156"
        subtitle="45 Pending"
        icon={<ClipboardList className="text-yellow-600" size={24} />}
        bgColor="bg-yellow-100"
      />
      <StatCard
        title="Performance"
        value="85%"
        subtitle="Above Target"
        icon={<TrendingUp className="text-purple-600" size={24} />}
        bgColor="bg-purple-100"
      />
    </div>
  );
}
