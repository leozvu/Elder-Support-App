import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Plus,
  Search,
  Filter,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  attendees: number;
  isAttending?: boolean;
  image?: string;
}

interface CommunityEventsProps {
  events?: Event[];
  onAttendEvent?: (eventId: string) => void;
  onCancelAttendance?: (eventId: string) => void;
  onCreateEvent?: (event: Omit<Event, "id" | "attendees">) => void;
}

const CommunityEvents = ({
  events: initialEvents = [
    {
      id: "1",
      title: "Senior Wellness Workshop",
      description:
        "Join us for a workshop on maintaining physical and mental wellness in your golden years.",
      date: "2023-06-15",
      time: "10:00 AM - 12:00 PM",
      location: "Community Center, 123 Main St",
      organizer: "Golden Years Association",
      category: "Health",
      attendees: 24,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    },
    {
      id: "2",
      title: "Technology for Seniors",
      description:
        "Learn how to use smartphones, tablets, and computers to stay connected with family and friends.",
      date: "2023-06-20",
      time: "2:00 PM - 4:00 PM",
      location: "Public Library, 456 Oak St",
      organizer: "Tech Helpers",
      category: "Education",
      attendees: 18,
      image:
        "https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=600&q=80",
    },
    {
      id: "3",
      title: "Community Garden Day",
      description:
        "Help plant and maintain our community garden. All tools and supplies provided.",
      date: "2023-06-25",
      time: "9:00 AM - 11:00 AM",
      location: "Community Garden, 789 Green St",
      organizer: "Green Thumbs Club",
      category: "Outdoors",
      attendees: 12,
      image:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80",
    },
    {
      id: "4",
      title: "Senior Social Hour",
      description:
        "Join us for coffee, snacks, and conversation with other seniors in the community.",
      date: "2023-06-18",
      time: "3:00 PM - 5:00 PM",
      location: "Senior Center, 321 Elm St",
      organizer: "Community Connections",
      category: "Social",
      attendees: 30,
      image:
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80",
    },
  ],
  onAttendEvent = () => {},
  onCancelAttendance = () => {},
  onCreateEvent = () => {},
}: CommunityEventsProps) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    category: "Social",
  });

  const categories = [
    "All",
    "Health",
    "Education",
    "Social",
    "Outdoors",
    "Arts",
    "Technology",
  ];

  const handleAttendEvent = (eventId: string) => {
    onAttendEvent(eventId);
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, isAttending: true, attendees: event.attendees + 1 }
          : event,
      ),
    );
  };

  const handleCancelAttendance = (eventId: string) => {
    onCancelAttendance(eventId);
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, isAttending: false, attendees: event.attendees - 1 }
          : event,
      ),
    );
  };

  const handleCreateEvent = () => {
    // Validate form
    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.date ||
      !newEvent.time ||
      !newEvent.location ||
      !newEvent.organizer
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Call the provided callback
    onCreateEvent(newEvent);

    // Add to local state with a generated ID
    const createdEvent: Event = {
      ...newEvent,
      id: `event_${Date.now()}`,
      attendees: 1, // Creator is the first attendee
      isAttending: true,
    };

    setEvents((prev) => [createdEvent, ...prev]);
    setIsCreateEventOpen(false);
    resetEventForm();
  };

  const resetEventForm = () => {
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      organizer: "",
      category: "Social",
    });
  };

  const handleViewEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  // Filter events based on search query and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null ||
      selectedCategory === "All" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Split events into upcoming and past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.date) >= today,
  );
  const pastEvents = sortedEvents.filter(
    (event) => new Date(event.date) < today,
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-6 w-6 text-primary" />
            Community Events
          </div>
          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Community Event</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new event for the community.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    placeholder="Senior Wellness Workshop"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-description">Description</Label>
                  <textarea
                    id="event-description"
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    placeholder="Describe your event..."
                    className="w-full p-2 border rounded-md min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      value={newEvent.time}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, time: e.target.value })
                      }
                      placeholder="10:00 AM - 12:00 PM"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-location">Location</Label>
                  <Input
                    id="event-location"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                    placeholder="Community Center, 123 Main St"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-organizer">Organizer</Label>
                    <Input
                      id="event-organizer"
                      value={newEvent.organizer}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, organizer: e.target.value })
                      }
                      placeholder="Your name or organization"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-category">Category</Label>
                    <select
                      id="event-category"
                      value={newEvent.category}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, category: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateEventOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent}>Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setSelectedCategory(null)}
              >
                <Filter className="h-4 w-4" />
                {selectedCategory || "All Categories"}
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() =>
                      setSelectedCategory(category === "All" ? null : category)
                    }
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="upcoming"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming" className="text-lg py-3">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger value="past" className="text-lg py-3">
              <Clock className="mr-2 h-5 w-5" />
              Past Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No upcoming events found</p>
                <Button
                  className="mt-4"
                  onClick={() => setIsCreateEventOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create an Event
                </Button>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {event.image && (
                      <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`p-6 ${event.image ? "md:w-2/3" : "w-full"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            {event.title}
                          </h3>
                          <Badge className="mb-3">{event.category}</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEventDetails(event)}
                        >
                          View Details
                        </Button>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {event.isAttending ? (
                          <Button
                            variant="outline"
                            onClick={() => handleCancelAttendance(event.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Cancel Attendance
                          </Button>
                        ) : (
                          <Button onClick={() => handleAttendEvent(event.id)}>
                            <Heart className="mr-2 h-4 w-4" />
                            I'll Attend
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastEvents.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No past events found</p>
              </div>
            ) : (
              pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow opacity-75"
                >
                  <div className="flex flex-col md:flex-row">
                    {event.image && (
                      <div className="md:w-1/3 h-48 md:h-auto overflow-hidden grayscale">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`p-6 ${event.image ? "md:w-2/3" : "w-full"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            {event.title}
                          </h3>
                          <Badge variant="outline" className="mb-3">
                            {event.category}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEventDetails(event)}
                        >
                          View Details
                        </Button>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{event.attendees} attended</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Event Details Dialog */}
        {selectedEvent && (
          <Dialog
            open={isEventDetailsOpen}
            onOpenChange={setIsEventDetailsOpen}
          >
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <Badge className="w-fit mt-2">{selectedEvent.category}</Badge>
              </DialogHeader>
              <div className="space-y-4">
                {selectedEvent.image && (
                  <div className="h-48 overflow-hidden rounded-md">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="text-gray-700">{selectedEvent.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Date</h4>
                      <p>{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Time</h4>
                      <p>{selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p>{selectedEvent.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Organizer</h4>
                      <p>{selectedEvent.organizer}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {selectedEvent.attendees} people attending
                      </span>
                    </div>
                    {new Date(selectedEvent.date) >= today && (
                      <div>
                        {selectedEvent.isAttending ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              handleCancelAttendance(selectedEvent.id);
                              setIsEventDetailsOpen(false);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Cancel Attendance
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              handleAttendEvent(selectedEvent.id);
                              setIsEventDetailsOpen(false);
                            }}
                          >
                            <Heart className="mr-2 h-4 w-4" />
                            I'll Attend
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityEvents;
