import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  Clock,
  Heart,
  Home,
  MapPin,
  Pill,
  ShoppingBag,
  Utensils,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  type:
    | "medication"
    | "wellness"
    | "location"
    | "service"
    | "meal"
    | "activity";
  description: string;
  time: string;
  details?: string;
}

interface ActivityTimelineProps {
  seniorId: string;
  limit?: number;
}

const ActivityTimeline = ({ seniorId, limit = 10 }: ActivityTimelineProps) => {
  // Mock data - in a real app, this would come from the database
  const timelineEvents: TimelineEvent[] = [
    {
      id: "event1",
      type: "medication",
      description: "Took Lisinopril",
      time: "Today, 8:05 AM",
      details: "10mg, on schedule",
    },
    {
      id: "event2",
      type: "meal",
      description: "Breakfast",
      time: "Today, 8:30 AM",
      details: "Oatmeal with fruit",
    },
    {
      id: "event3",
      type: "activity",
      description: "Morning exercise",
      time: "Today, 9:15 AM",
      details: "15 minutes of stretching",
    },
    {
      id: "event4",
      type: "service",
      description: "Grocery delivery",
      time: "Today, 10:30 AM",
    },
    {
      id: "event5",
      type: "wellness",
      description: "Blood pressure check",
      time: "Today, 11:00 AM",
      details: "128/82 - normal range",
    },
    {
      id: "event6",
      type: "meal",
      description: "Lunch",
      time: "Today, 12:15 PM",
      details: "Chicken salad sandwich",
    },
    {
      id: "event7",
      type: "medication",
      description: "Took Metformin",
      time: "Today, 12:30 PM",
      details: "500mg, on schedule",
    },
    {
      id: "event8",
      type: "location",
      description: "Left home",
      time: "Today, 2:00 PM",
    },
    {
      id: "event9",
      type: "location",
      description: "Arrived at Community Center",
      time: "Today, 2:15 PM",
      details: "Weekly book club meeting",
    },
    {
      id: "event10",
      type: "location",
      description: "Left Community Center",
      time: "Today, 4:00 PM",
    },
    {
      id: "event11",
      type: "location",
      description: "Arrived home",
      time: "Today, 4:20 PM",
    },
    {
      id: "event12",
      type: "meal",
      description: "Dinner",
      time: "Today, 6:00 PM",
      details: "Baked salmon with vegetables",
    },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill className="h-4 w-4 text-blue-500" />;
      case "wellness":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "location":
        return <MapPin className="h-4 w-4 text-purple-500" />;
      case "service":
        return <ShoppingBag className="h-4 w-4 text-green-500" />;
      case "meal":
        return <Utensils className="h-4 w-4 text-yellow-500" />;
      case "activity":
        return <Activity className="h-4 w-4 text-indigo-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "medication":
        return "border-blue-200 bg-blue-50";
      case "wellness":
        return "border-red-200 bg-red-50";
      case "location":
        return "border-purple-200 bg-purple-50";
      case "service":
        return "border-green-200 bg-green-50";
      case "meal":
        return "border-yellow-200 bg-yellow-50";
      case "activity":
        return "border-indigo-200 bg-indigo-50";
      default:
        return "border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l border-gray-200 space-y-4">
          {timelineEvents.slice(0, limit).map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                {getEventIcon(event.type)}
              </div>

              {/* Event card */}
              <div
                className={`ml-2 p-3 rounded-md border ${getEventColor(event.type)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">
                        {event.description}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    {event.details && (
                      <p className="text-xs text-gray-600 mt-1">
                        {event.details}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {timelineEvents.length > limit && (
            <div className="text-center text-sm text-gray-500 pt-2">
              + {timelineEvents.length - limit} more activities
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
