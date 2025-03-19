import React from "react";
import { Badge } from "@/components/ui/badge";

type ServiceStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "expired"
  | "rejected";

interface ServiceStatusBadgeProps {
  status: ServiceStatus;
  className?: string;
}

const ServiceStatusBadge = ({
  status,
  className = "",
}: ServiceStatusBadgeProps) => {
  const getStatusConfig = (status: ServiceStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          variant: "outline" as const,
          className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };
      case "accepted":
        return {
          label: "Accepted",
          variant: "outline" as const,
          className: "bg-blue-100 text-blue-800 border-blue-300",
        };
      case "in_progress":
        return {
          label: "In Progress",
          variant: "outline" as const,
          className: "bg-purple-100 text-purple-800 border-purple-300",
        };
      case "completed":
        return {
          label: "Completed",
          variant: "outline" as const,
          className: "bg-green-100 text-green-800 border-green-300",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          variant: "outline" as const,
          className: "bg-red-100 text-red-800 border-red-300",
        };
      case "expired":
        return {
          label: "Expired",
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-800 border-gray-300",
        };
      case "rejected":
        return {
          label: "Rejected",
          variant: "outline" as const,
          className: "bg-red-100 text-red-800 border-red-300",
        };
      default:
        return {
          label:
            status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-800 border-gray-300",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
};

export default ServiceStatusBadge;
