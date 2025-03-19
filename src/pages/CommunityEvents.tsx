import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import CommunityEventsCard from "@/components/community/CommunityEventsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, List, MapPin, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import EventDetailsDialog from "@/components/community/EventDetailsDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  description?: string;
  dateObj?: Date; // For calendar view
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  isRegistered?: boolean;
  imageUrl?: string;
}

const CommunityEvents = () => {
  const [events, setEvents] = useState<Event[]>([
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
      dateObj: new Date(2024, 4, 25), // May 25, 2024
      organizer: "Senior Community Association",
      contactEmail: "events@seniorcare.example",
      contactPhone: "(555) 123-4567",
      isRegistered: false,
      imageUrl:
        "https://images.unsplash.com/photo-1606503153255-59d8b2e4739e?w=800&q=80",
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
      dateObj: new Date(2024, 4, 27), // May 27, 2024
      organizer: "Wellness Center",
      contactEmail: "wellness@seniorcare.example",
      contactPhone: "(555) 234-5678",
      isRegistered: true,
      imageUrl:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
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
      dateObj: new Date(2024, 4, 29), // May 29, 2024
      organizer: "Public Library",
      contactEmail: "library@seniorcare.example",
      contactPhone: "(555) 345-6789",
      isRegistered: false,
      imageUrl:
        "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=800&q=80",
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
      dateObj: new Date(2024, 5, 1), // June 1, 2024
      organizer: "Green Thumbs Society",
      contactEmail: "garden@seniorcare.example",
      contactPhone: "(555) 456-7890",
      isRegistered: false,
      imageUrl:
        "https://images.unsplash.com/photo-1599685315640-4a9ba2613517?w=800&q=80",
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
      dateObj: new Date(2024, 5, 3), // June 3, 2024
      organizer: "Film Appreciation Club",
      contactEmail: "movies@seniorcare.example",
      contactPhone: "(555) 567-8901",
      isRegistered: false,
      imageUrl:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    },
    {
      id: "6",
      title: "Book Club Meeting",
      date: "June 5, 2024",
      time: "1:00 PM",
      location: "Library",
      category: "Education",
      attendees: 10,
      description:
        "This month we're discussing 'The Thursday Murder Club' by Richard Osman.",
      dateObj: new Date(2024, 5, 5), // June 5, 2024
      organizer: "Book Lovers Club",
      contactEmail: "books@seniorcare.example",
      contactPhone: "(555) 678-9012",
      isRegistered: true,
      imageUrl:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80",
    },
    {
      id: "7",
      title: "Tai Chi in the Park",
      date: "June 7, 2024",
      time: "8:00 AM",
      location: "Central Park",
      category: "Health",
      attendees: 14,
      description:
        "Gentle morning exercise suitable for all fitness levels. Wear comfortable clothing.",
      dateObj: new Date(2024, 5, 7), // June 7, 2024
      organizer: "Healthy Aging Initiative",
      contactEmail: "taichi@seniorcare.example",
      contactPhone: "(555) 789-0123",
      isRegistered: false,
      imageUrl:
        "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?w=800&q=80",
    },
    {
      id: "8",
      title: "Community Lunch",
      date: "June 10, 2024",
      time: "12:00 PM",
      location: "Senior Center",
      category: "Social",
      attendees: 30,
      description:
        "Monthly community lunch. This month's menu: Italian cuisine.",
      dateObj: new Date(2024, 5, 10), // June 10, 2024
      organizer: "Community Kitchen",
      contactEmail: "lunch@seniorcare.example",
      contactPhone: "(555) 890-1234",
      isRegistered: false,
      imageUrl:
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
    },
  ]);

  const [filteredEvents, setFilteredEvents] = useState(events);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRegister = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, isRegistered: true, attendees: event.attendees + 1 }
          : event,
      ),
    );

    setFilteredEvents(
      filteredEvents.map((event) =>
        event.id === eventId
          ? { ...event, isRegistered: true, attendees: event.attendees + 1 }
          : event,
      ),
    );

    setIsEventDialogOpen(false);
  };

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    filterEvents(category, selectedDate, searchQuery);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    filterEvents(selectedCategory, date, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterEvents(selectedCategory, selectedDate, query);
  };

  const filterEvents = (category: string, date?: Date, query: string = "") => {
    let filtered = events;

    // Filter by category if not "All"
    if (category !== "All") {
      filtered = filtered.filter((event) => event.category === category);
    }

    // Filter by date if selected
    if (date) {
      filtered = filtered.filter((event) => {
        if (!event.dateObj) return false;
        return (
          event.dateObj.getDate() === date.getDate() &&
          event.dateObj.getMonth() === date.getMonth() &&
          event.dateObj.getFullYear() === date.getFullYear()
        );
      });
    }

    // Filter by search query
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(lowercaseQuery) ||
          event.description?.toLowerCase().includes(lowercaseQuery) ||
          event.location.toLowerCase().includes(lowercaseQuery) ||
          event.category.toLowerCase().includes(lowercaseQuery),
      );
    }

    setFilteredEvents(filtered);
  };

  // Function to highlight dates with events on the calendar
  const getDayClassNames = (date: Date) => {
    const hasEvent = events.some((event) => {
      if (!event.dateObj) return false;
      return (
        event.dateObj.getDate() === date.getDate() &&
        event.dateObj.getMonth() === date.getMonth() &&
        event.dateObj.getFullYear() === date.getFullYear()
      );
    });

    return hasEvent ? "bg-primary/20 text-primary font-bold" : "";
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const categories = ["All", "Social", "Health", "Education", "Hobby"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Community Events</h1>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-0">
            <CommunityEventsCard
              events={filteredEvents}
              onViewEvent={(id) => {
                if (id === "all") return;
                const event = events.find((e) => e.id === id);
                if (event) {
                  setSelectedEvent(event);
                  setIsEventDialogOpen(true);
                }
              }}
              onRegister={handleRegister}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Select a Date</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="rounded-md border shadow"
                      classNames={{
                        day_today: "bg-primary/10",
                        day: (date) => getDayClassNames(date),
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {selectedDate
                        ? `Events on ${selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                        : "All Upcoming Events"}
                    </h3>

                    {filteredEvents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 border rounded-md">
                        No events found for the selected date
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {filteredEvents.map((event) => (
                          <div
                            key={event.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium">{event.title}</h4>
                              <span className="text-sm text-gray-500">
                                {event.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.location}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">
                    Map view showing event locations
                  </p>
                  <div className="bg-gray-100 rounded-lg h-[400px] flex items-center justify-center">
                    <p className="text-gray-500">
                      Map integration would be displayed here
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    In the full implementation, this would show a map with pins
                    for each event location
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedEvent && (
          <EventDetailsDialog
            event={selectedEvent}
            onRegister={handleRegister}
            open={isEventDialogOpen}
            onOpenChange={setIsEventDialogOpen}
          />
        )}
      </div>
    </Layout>
  );
};

export default CommunityEvents;
