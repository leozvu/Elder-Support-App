import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  description?: string;
}

interface CommunityEventsSectionProps {
  events?: Event[];
  onViewAll?: () => void;
  onRegister?: (eventId: string) => void;
  maxEvents?: number;
}

const CommunityEventsSection = ({
  events = [
    {
      id: "1",
      title: "Weekly Bingo Night",
      date: "May 25, 2024",
      time: "6:00 PM",
      location: "Community Center",
      category: "Social",
      attendees: 18,
    },
    {
      id: "2",
      title: "Health & Wellness Workshop",
      date: "May 27, 2024",
      time: "10:00 AM",
      location: "Senior Hub",
      category: "Health",
      attendees: 12,
    },
    {
      id: "3",
      title: "Computer Skills Class",
      date: "May 29, 2024",
      time: "2:00 PM",
      location: "Library",
      category: "Education",
      attendees: 8,
    },
  ],
  onViewAll,
  onRegister = (eventId) => console.log(`Register for event ${eventId}`),
  maxEvents = 3,
}: CommunityEventsSectionProps) => {
  const navigate = useNavigate();

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "social":
        return "bg-blue-100 text-blue-800";
      case "health":
        return "bg-green-100 text-green-800";
      case "education":
        return "bg-purple-100 text-purple-800";
      case "hobby":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/community-events");
    }
  };

  // Display only the first maxEvents events
  const displayedEvents = events.slice(0, maxEvents);

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Community Events
          </CardTitle>
          <Button
            variant="ghost"
            onClick={handleViewAll}
            className="flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{event.title}</h3>
                <Badge className={getCategoryColor(event.category)}>
                  {event.category}
                </Badge>
              </div>
              {event.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {event.description}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.attendees} attending</span>
                </div>
              </div>
              <Button
                onClick={() => onRegister(event.id)}
                variant="outline"
                className="w-full"
              >
                Register
              </Button>
            </div>
          ))}

          {events.length > maxEvents && (
            <div className="text-center pt-2">
              <Button
                variant="link"
                onClick={handleViewAll}
                className="text-primary"
              >
                See {events.length - maxEvents} more events
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityEventsSection;
