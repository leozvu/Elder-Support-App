import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Info,
} from "lucide-react";

interface ServiceStatusPanelProps {
  serviceId: string;
  serviceType: string;
  scheduledTime: string;
  location: string;
  status:
    | "pending"
    | "accepted"
    | "en_route"
    | "arrived"
    | "in_progress"
    | "completed"
    | "cancelled";
  helperName?: string;
  helperAvatar?: string;
  notes?: string;
  caregiverNotes?: string;
  specificNeeds?: string[];
  onCancelService?: () => void;
  onCompleteService?: () => void;
  onReportIssue?: () => void;
  className?: string;
}

const ServiceStatusPanel: React.FC<ServiceStatusPanelProps> = ({
  serviceId,
  serviceType,
  scheduledTime,
  location,
  status,
  helperName,
  helperAvatar,
  notes,
  caregiverNotes,
  specificNeeds,
  onCancelService,
  onCompleteService,
  onReportIssue,
  className,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>;
      case "en_route":
        return <Badge className="bg-blue-100 text-blue-800">En Route</Badge>;
      case "arrived":
        return <Badge className="bg-green-100 text-green-800">Arrived</Badge>;
      case "in_progress":
        return (
          <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>
        );
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case "pending":
        return "Your service request is pending assignment to a helper.";
      case "accepted":
        return `${helperName} has accepted your service request and will be on their way soon.`;
      case "en_route":
        return `${helperName} is on the way to your location.`;
      case "arrived":
        return `${helperName} has arrived at your location.`;
      case "in_progress":
        return `${helperName} is currently providing the requested service.`;
      case "completed":
        return "The service has been completed. Thank you for using our service!";
      case "cancelled":
        return "This service request has been cancelled.";
      default:
        return "";
    }
  };

  const getActionButtons = () => {
    switch (status) {
      case "pending":
      case "accepted":
      case "en_route":
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancelService}
            >
              <XCircle className="mr-2 h-4 w-4" /> Cancel Service
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onReportIssue}
            >
              <AlertCircle className="mr-2 h-4 w-4" /> Report Issue
            </Button>
          </div>
        );
      case "arrived":
      case "in_progress":
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onReportIssue}
            >
              <AlertCircle className="mr-2 h-4 w-4" /> Report Issue
            </Button>
            <Button className="flex-1" onClick={onCompleteService}>
              <CheckCircle className="mr-2 h-4 w-4" /> Complete Service
            </Button>
          </div>
        );
      case "completed":
        return (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = `/review/${serviceId}`)}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Leave a Review
          </Button>
        );
      case "cancelled":
        return (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/request")}
          >
            Request New Service
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{serviceType}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{getStatusDescription()}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{formatDate(scheduledTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">{formatTime(scheduledTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{location}</p>
            </div>
          </div>
        </div>

        {helperName && status !== "pending" && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src={
                  helperAvatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${helperName}`
                }
                alt={helperName}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-1" />
                <p className="font-medium">{helperName}</p>
              </div>
              <p className="text-sm text-gray-500">
                {status === "completed" ? "Service Provider" : "Your Helper"}
              </p>
            </div>
          </div>
        )}

        {notes && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-1">Notes</p>
            <p className="text-sm text-blue-700">{notes}</p>
          </div>
        )}

        {caregiverNotes && (
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <p className="text-sm font-medium text-amber-800">
                Caregiver Instructions
              </p>
            </div>
            <p className="text-sm text-amber-700">{caregiverNotes}</p>
          </div>
        )}

        {specificNeeds && specificNeeds.length > 0 && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-800 mb-1">
              Specific Needs
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {specificNeeds.map((need, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-purple-100 text-purple-800"
                >
                  {need}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {getActionButtons()}
      </CardContent>
    </Card>
  );
};

export default ServiceStatusPanel;
