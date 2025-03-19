import React from "react";

interface ElderlyUser {
  id: string;
  name: string;
  avatar: string;
  age: number;
  address: string;
  phone: string;
  emergencyContact: string;
  lastActive: string;
  status: "active" | "inactive" | "emergency";
}

interface FamilyMemberProps {
  user: ElderlyUser;
  isSelected: boolean;
  onSelect: (user: ElderlyUser) => void;
  getTimeSince: (dateStr: string) => string;
}

const FamilyMember: React.FC<FamilyMemberProps> = ({
  user,
  isSelected,
  onSelect,
  getTimeSince,
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-gray-50" : ""}`}
      onClick={() => onSelect(user)}
    >
      <div className="relative">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full"
        />
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === "active" ? "bg-green-500" : user.status === "emergency" ? "bg-red-500" : "bg-yellow-500"}`}
        ></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.name}</p>
        <p className="text-sm text-gray-500">
          Last active: {getTimeSince(user.lastActive)}
        </p>
      </div>
    </div>
  );
};

export default FamilyMember;
