import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface CommunityEventsCardProps {
  events?: Event[];
  onViewAll?: () => void;
  onRegister?: (eventId: string) => void;
  onFilter?: (category: string) => void;
  onSearch?: (query: string) => void;
}

const CommunityEventsCard = ({
  events = [
    {
      id: "1",
      title: "Weekly Bingo Night",
      date: "May 25, 2024",
      time: "6:00 PM",
      location: "Community Center",
      category: "Social",
      attendees: 18,
      description:
        "Join us for a fun evening of bingo with prizes and refreshments.",
    },
    {
      id: "2",
      title: "Health & Wellness Workshop",
      date: "May 27, 2024",
      time: "10:00 AM",
      location: "Senior Hub",
      category: "Health",
      attendees: 12,
      description:
        "Learn about maintaining good health with expert speakers and demonstrations.",
    },
    {
      id: "3",
      title: "Computer Skills Class",
      date: "May 29, 2024",
      time: "2:00 PM",
      location: "Library",
      category: "Education",
      attendees: 8,
      description:
        "Basic computer skills workshop for beginners. Bring your own device or use ours.",
    },
    {
      id: "4",
      title: "Gardening Club",
      date: "June 1, 2024",
      time: "9:00 AM",
      location: "Community Garden",
      category: "Hobby",
      attendees: 15,
      description:
        "Monthly meeting of the gardening club. This month's focus: summer vegetables.",
    },
    {
      id: "5",
      title: "Movie Afternoon",
      date: "June 3, 2024",
      time: "3:00 PM",
      location: "Recreation Center",
      category: "Social",
      attendees: 22,
      description:
        "Join us for a classic film screening with popcorn and discussion afterward.",
    },
  ],
  onViewAll = () => console.log("View all events clicked"),
  onRegister = (eventId) => console.log(`Register for event ${eventId}`),
  onFilter = (category) => console.log(`Filter by category: ${category}`),
  onSearch = (query) => console.log(`Search for: ${query}`),
}: CommunityEventsCardProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onFilter(value);
  };

  // Get unique categories from events
  const categories = ["All", ...new Set(events.map((event) => event.category))];

  // Filter events based on selected category
  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Community Events
          </CardTitle>
          <Button variant="ghost" onClick={onViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-0 top-0 h-full rounded-l-none"
              >
                Search
              </Button>
            </div>
          </form>
          <div className="w-full sm:w-48">
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events found matching your criteria
            </div>
          ) : (
            filteredEvents.map((event) => (
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
                  <p className="text-gray-600 text-sm mb-3">
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityEventsCard;
