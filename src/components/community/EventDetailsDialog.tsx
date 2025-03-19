import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Calendar as CalendarIcon,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  description?: string;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface EventDetailsDialogProps {
  event: Event;
  onRegister: (eventId: string) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const EventDetailsDialog = ({
  event,
  onRegister,
  trigger,
  open,
  onOpenChange,
}: EventDetailsDialogProps) => {
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

  const handleAddToCalendar = () => {
    console.log(`Adding event ${event.id} to calendar`);
    // In a real implementation, this would create a calendar event
  };

  const handleShare = () => {
    console.log(`Sharing event ${event.id}`);
    // In a real implementation, this would open a share dialog
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
          </div>
          <DialogDescription className="text-base text-gray-700 mt-2">
            {event.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Date</p>
                <p>{event.date}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Time</p>
                <p>{event.time}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Location</p>
                <p>{event.location}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Attendees</p>
                <p>{event.attendees} registered</p>
              </div>
            </div>
          </div>

          {(event.organizer || event.contactEmail || event.contactPhone) && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Contact Information</h3>
              {event.organizer && (
                <p className="text-sm">Organizer: {event.organizer}</p>
              )}
              {event.contactEmail && (
                <p className="text-sm">
                  Email:{" "}
                  <a
                    href={`mailto:${event.contactEmail}`}
                    className="text-primary"
                  >
                    {event.contactEmail}
                  </a>
                </p>
              )}
              {event.contactPhone && (
                <p className="text-sm">
                  Phone:{" "}
                  <a
                    href={`tel:${event.contactPhone}`}
                    className="text-primary"
                  >
                    {event.contactPhone}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCalendar}
              className="flex items-center gap-1"
            >
              <CalendarIcon className="h-4 w-4" />
              Add to Calendar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          <Button onClick={() => onRegister(event.id)} className="sm:ml-auto">
            Register Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
