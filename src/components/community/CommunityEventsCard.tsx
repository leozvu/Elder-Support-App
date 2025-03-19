import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, ChevronRight } from "lucide-react";

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  isRegistered?: boolean;
  imageUrl?: string;
}

interface CommunityEventsCardProps {
  events?: CommunityEvent[];
  onViewEvent?: (id: string) => void;
  onRegister?: (id: string) => void;
  onFilter?: (category: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

const CommunityEventsCard = ({
  events = [
    {
      id: "1",
      title: "Senior Yoga Class",
      description: "Gentle yoga session for seniors of all abilities",
      date: "2023-06-15",
      time: "10:00 AM",
      location: "Community Center, 123 Main St",
      category: "Fitness",
      attendees: 12,
      isRegistered: false,
      imageUrl:
        "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?w=800&q=80",
    },
    {
      id: "2",
      title: "Book Club Meeting",
      description: "Discussion of 'The Thursday Murder Club'",
      date: "2023-06-18",
      time: "2:00 PM",
      location: "Public Library, 456 Oak Ave",
      category: "Social",
      attendees: 8,
      isRegistered: true,
      imageUrl:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80",
    },
    {
      id: "3",
      title: "Technology Workshop",
      description: "Learn to use smartphones and tablets effectively",
      date: "2023-06-20",
      time: "11:00 AM",
      location: "Senior Hub, 789 Pine St",
      category: "Education",
      attendees: 15,
      isRegistered: false,
      imageUrl:
        "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=800&q=80",
    },
  ],
  onViewEvent = (id) => {},
  onRegister = (id) => {},
  onFilter,
  onSearch,
  className = "",
}: CommunityEventsCardProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "fitness":
        return "bg-green-100 text-green-800";
      case "social":
        return "bg-blue-100 text-blue-800";
      case "education":
        return "bg-purple-100 text-purple-800";
      case "health":
        return "bg-red-100 text-red-800";
      case "hobby":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold">Community Events</CardTitle>
        <Button variant="outline" onClick={() => onViewEvent("all")}>
          View All Events
        </Button>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg text-muted-foreground">
              No upcoming events. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg overflow-hidden flex flex-col md:flex-row"
              >
                {event.imageUrl && (
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      className={`absolute top-2 left-2 ${getCategoryColor(event.category)}`}
                    >
                      {event.category}
                    </Badge>
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center col-span-1 md:col-span-2">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center"
                      onClick={() => onViewEvent(event.id)}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button
                      variant={event.isRegistered ? "outline" : "default"}
                      size="sm"
                      onClick={() => onRegister(event.id)}
                      disabled={event.isRegistered}
                    >
                      {event.isRegistered ? "Registered" : "Register"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityEventsCard;
