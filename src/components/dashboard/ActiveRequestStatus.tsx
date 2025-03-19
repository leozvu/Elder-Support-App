import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import {
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  LogIn,
  LogOut,
} from "lucide-react";

interface HelperInfo {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  phone: string;
}

interface RequestStatusProps {
  requestId?: string;
  serviceType?: "shopping" | "medical" | "companionship" | "other";
  status?: "confirmed" | "en-route" | "arrived" | "in-progress" | "completed";
  helper?: HelperInfo;
  estimatedArrival?: string;
  scheduledTime?: string;
  location?: string;
  progress?: number;
  checkInTime?: string;
  checkOutTime?: string;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onEmergencyChat?: () => void;
}

const getStatusColor = (status: RequestStatusProps["status"]) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "en-route":
      return "bg-amber-100 text-amber-800";
    case "arrived":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: RequestStatusProps["status"]) => {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "en-route":
      return "Helper On The Way";
    case "arrived":
      return "Helper Has Arrived";
    case "in-progress":
      return "Service In Progress";
    case "completed":
      return "Service Completed";
    default:
      return "Unknown Status";
  }
};

const ActiveRequestStatus = ({
  requestId = "REQ-12345",
  serviceType = "shopping",
  status = "en-route",
  helper = {
    id: "helper-123",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 4.8,
    phone: "(555) 123-4567",
  },
  estimatedArrival = "10 minutes",
  scheduledTime = "Today, 2:00 PM",
  location = "123 Main Street, Apt 4B",
  progress = 40,
  checkInTime,
  checkOutTime,
  onCheckIn = () => {},
  onCheckOut = () => {},
  onEmergencyChat = () => {},
}: RequestStatusProps) => {
  const serviceTypeLabels = {
    shopping: "Grocery Shopping",
    medical: "Medical Appointment",
    companionship: "Companionship Visit",
    other: "Assistance Service",
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            {serviceTypeLabels[serviceType]}
          </CardTitle>
          <Badge className={`text-lg px-4 py-1 ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Helper Information */}
          <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-50">
            <Avatar className="h-24 w-24 mb-3">
              <AvatarImage src={helper.avatar} alt={helper.name} />
              <AvatarFallback className="text-2xl">
                {helper.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-1">{helper.name}</h3>
            <div className="flex items-center mb-2">
              <span className="text-yellow-500">★</span>
              <span className="text-lg ml-1">{helper.rating}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Phone className="h-5 w-5" />
                <span>Call</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Message</span>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex items-center gap-2"
                onClick={onEmergencyChat}
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Emergency</span>
              </Button>
            </div>
          </div>

          {/* Status Information */}
          <div className="col-span-2 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-gray-500 mt-1" />
                <div>
                  <p className="text-lg font-medium">Estimated Arrival</p>
                  <p className="text-2xl">{estimatedArrival}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-6 w-6 text-gray-500 mt-1" />
                <div>
                  <p className="text-lg font-medium">Scheduled Time</p>
                  <p className="text-xl">{scheduledTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-gray-500 mt-1" />
                <div>
                  <p className="text-lg font-medium">Location</p>
                  <p className="text-xl">{location}</p>
                </div>
              </div>
            </div>

            {status === "en-route" && (
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-medium">Helper's Progress</span>
                  <span className="text-lg">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            )}
          </div>
        </div>

        {/* Safety Check-in/Check-out Section */}
        {(status === "arrived" || status === "in-progress") && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-3">
              Safety Check-in/Check-out
            </h3>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div>
                <p className="text-gray-600 mb-2">Check-in Status:</p>
                {checkInTime ? (
                  <Badge className="bg-green-100 text-green-800 text-sm py-1 px-3">
                    <LogIn className="h-4 w-4 mr-2" /> Checked in at{" "}
                    {checkInTime}
                  </Badge>
                ) : (
                  <Button
                    onClick={onCheckIn}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <LogIn className="h-4 w-4" /> Check In
                  </Button>
                )}
              </div>

              <div>
                <p className="text-gray-600 mb-2">Check-out Status:</p>
                {checkOutTime ? (
                  <Badge className="bg-green-100 text-green-800 text-sm py-1 px-3">
                    <LogOut className="h-4 w-4 mr-2" /> Checked out at{" "}
                    {checkOutTime}
                  </Badge>
                ) : (
                  <Button
                    onClick={onCheckOut}
                    className="flex items-center gap-2"
                    disabled={!checkInTime}
                    variant="outline"
                  >
                    <LogOut className="h-4 w-4" /> Check Out
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {status === "completed" && (
          <div className="mt-6 text-center">
            <Button className="text-lg px-6 py-2">Rate Your Experience</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveRequestStatus;
