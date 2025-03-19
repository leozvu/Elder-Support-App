import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar as CalendarIcon,
  Check,
  X,
  Repeat,
  AlertCircle,
  Bell,
} from "lucide-react";
import {
  format,
  addDays,
  isSameDay,
  addWeeks,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "unavailable";
  serviceId?: string;
  recurring?: "none" | "weekly" | "biweekly" | "monthly";
  recurrenceEndDate?: Date;
  bufferBefore?: number; // Buffer time in minutes before appointment
  bufferAfter?: number; // Buffer time in minutes after appointment
  notes?: string;
}

interface HelperAvailabilityCalendarProps {
  initialTimeSlots?: TimeSlot[];
  onAvailabilityChange?: (timeSlots: TimeSlot[]) => void;
  className?: string;
  helperId?: string; // Helper ID for database operations
  readOnly?: boolean; // If true, calendar is view-only
}

const HelperAvailabilityCalendar = ({
  initialTimeSlots = [],
  onAvailabilityChange = () => {},
  className = "",
  helperId,
  readOnly = false,
}: HelperAvailabilityCalendarProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState("calendar");
  const [isLoading, setIsLoading] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<
    "none" | "weekly" | "biweekly" | "monthly"
  >("none");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>(
    addWeeks(new Date(), 4),
  );
  const [bufferBefore, setBufferBefore] = useState(15); // 15 minutes buffer before by default
  const [bufferAfter, setBufferAfter] = useState(15); // 15 minutes buffer after by default
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  // Subscribe to real-time updates if helperId is provided
  useEffect(() => {
    if (!helperId) return;

    // Load helper's availability from database
    const loadAvailability = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("helper_availability")
          .select("*")
          .eq("helper_id", helperId);

        if (error) throw error;

        if (data && data.length > 0) {
          // Convert database format to TimeSlot format
          const loadedSlots: TimeSlot[] = data.map((slot) => ({
            id: slot.id,
            date: new Date(slot.date),
            startTime: slot.start_time,
            endTime: slot.end_time,
            status: slot.status,
            serviceId: slot.service_id,
            recurring: slot.recurring || "none",
            recurrenceEndDate: slot.recurrence_end_date
              ? new Date(slot.recurrence_end_date)
              : undefined,
            bufferBefore: slot.buffer_before || 0,
            bufferAfter: slot.buffer_after || 0,
            notes: slot.notes,
          }));

          setTimeSlots(loadedSlots);
        }
      } catch (error) {
        console.error("Error loading availability:", error);
        toast({
          variant: "destructive",
          title: "Failed to load availability",
          description: "Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailability();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel("helper_availability_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "helper_availability",
          filter: `helper_id=eq.${helperId}`,
        },
        (payload) => {
          // Refresh availability data when changes occur
          loadAvailability();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [helperId, toast]);

  // Generate time slots for the selected date
  const generateTimeSlots = (selectedDate: Date): string[] => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  };

  // Get time slots for the selected date
  const getTimeSlotsForDate = (selectedDate: Date): TimeSlot[] => {
    return timeSlots.filter((slot) =>
      isSameDay(new Date(slot.date), selectedDate),
    );
  };

  // Toggle availability for a specific time slot
  const toggleTimeSlot = async (startTime: string, endTime: string) => {
    if (readOnly) return;

    const existingSlot = timeSlots.find(
      (slot) =>
        isSameDay(new Date(slot.date), date) &&
        slot.startTime === startTime &&
        slot.endTime === endTime,
    );

    if (existingSlot) {
      // Remove the slot if it exists
      const updatedSlots = timeSlots.filter(
        (slot) => slot.id !== existingSlot.id,
      );
      setTimeSlots(updatedSlots);
      onAvailabilityChange(updatedSlots);

      // If helperId is provided, delete from database
      if (helperId && existingSlot.id.startsWith("db-")) {
        try {
          const { error } = await supabase
            .from("helper_availability")
            .delete()
            .eq("id", existingSlot.id.replace("db-", ""));

          if (error) throw error;

          toast({
            title: "Availability removed",
            description: "Your availability has been updated.",
          });
        } catch (error) {
          console.error("Error removing availability:", error);
          toast({
            variant: "destructive",
            title: "Failed to remove availability",
            description: "Please try again later.",
          });
        }
      }
    } else {
      // Add a new available slot
      const newSlot: TimeSlot = {
        id: `slot-${Date.now()}`,
        date: new Date(date),
        startTime,
        endTime,
        status: "available",
        recurring: recurringPattern,
        recurrenceEndDate:
          recurringPattern !== "none" ? recurrenceEndDate : undefined,
        bufferBefore,
        bufferAfter,
        notes,
      };

      // Generate recurring slots if applicable
      let allNewSlots: TimeSlot[] = [newSlot];

      if (recurringPattern !== "none" && recurrenceEndDate) {
        let currentDate = new Date(date);
        let increment =
          recurringPattern === "weekly"
            ? 7
            : recurringPattern === "biweekly"
              ? 14
              : 30;

        // Add recurring slots
        while (true) {
          // Calculate next date based on pattern
          if (recurringPattern === "monthly") {
            currentDate = new Date(currentDate);
            currentDate.setMonth(currentDate.getMonth() + 1);
          } else {
            currentDate = addDays(currentDate, increment);
          }

          // Stop if we've passed the end date
          if (isAfter(currentDate, recurrenceEndDate)) break;

          // Create a new slot for this date
          const recurringSlot: TimeSlot = {
            ...newSlot,
            id: `slot-${Date.now()}-${currentDate.getTime()}`,
            date: new Date(currentDate),
          };

          allNewSlots.push(recurringSlot);
        }
      }

      const updatedSlots = [...timeSlots, ...allNewSlots];
      setTimeSlots(updatedSlots);
      onAvailabilityChange(updatedSlots);

      // If helperId is provided, save to database
      if (helperId) {
        try {
          // Save all slots to database
          const dbSlots = allNewSlots.map((slot) => ({
            helper_id: helperId,
            date: slot.date.toISOString().split("T")[0],
            start_time: slot.startTime,
            end_time: slot.endTime,
            status: slot.status,
            recurring: slot.recurring,
            recurrence_end_date: slot.recurrenceEndDate?.toISOString(),
            buffer_before: slot.bufferBefore,
            buffer_after: slot.bufferAfter,
            notes: slot.notes,
          }));

          const { data, error } = await supabase
            .from("helper_availability")
            .insert(dbSlots)
            .select();

          if (error) throw error;

          toast({
            title: "Availability saved",
            description: `${allNewSlots.length > 1 ? `${allNewSlots.length} time slots` : "Time slot"} added to your schedule.`,
          });
        } catch (error) {
          console.error("Error saving availability:", error);
          toast({
            variant: "destructive",
            title: "Failed to save availability",
            description: "Please try again later.",
          });
        }
      }
    }
  };

  // Set availability for the entire day
  const setDayAvailability = (available: boolean) => {
    setIsAvailable(available);
    if (available) {
      // Generate standard time slots for the day
      const timeList = generateTimeSlots(date);
      const newSlots: TimeSlot[] = [];

      // Create time slots with 1-hour duration
      for (let i = 0; i < timeList.length - 2; i += 2) {
        const startTime = timeList[i];
        const endTime = timeList[i + 2];
        newSlots.push({
          id: `slot-${Date.now()}-${i}`,
          date: new Date(date),
          startTime,
          endTime,
          status: "available",
        });
      }

      // Remove existing slots for this day and add new ones
      const filteredSlots = timeSlots.filter(
        (slot) => !isSameDay(new Date(slot.date), date),
      );
      const updatedSlots = [...filteredSlots, ...newSlots];
      setTimeSlots(updatedSlots);
      onAvailabilityChange(updatedSlots);
    } else {
      // Remove all slots for this day
      const updatedSlots = timeSlots.filter(
        (slot) => !isSameDay(new Date(slot.date), date),
      );
      setTimeSlots(updatedSlots);
      onAvailabilityChange(updatedSlots);
    }
  };

  // Check if a time slot is selected
  const isTimeSlotSelected = (startTime: string, endTime: string): boolean => {
    return timeSlots.some(
      (slot) =>
        isSameDay(new Date(slot.date), date) &&
        slot.startTime === startTime &&
        slot.endTime === endTime,
    );
  };

  // Get upcoming bookings
  const getUpcomingBookings = (): TimeSlot[] => {
    return timeSlots
      .filter(
        (slot) => slot.status === "booked" && new Date(slot.date) >= new Date(),
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Render time slot selection grid
  const renderTimeSlotGrid = () => {
    const timeList = generateTimeSlots(date);
    const rows = [];

    // Create time slots with 1-hour duration
    for (let i = 0; i < timeList.length - 2; i += 2) {
      const startTime = timeList[i];
      const endTime = timeList[i + 2];
      const isSelected = isTimeSlotSelected(startTime, endTime);

      rows.push(
        <Button
          key={`${startTime}-${endTime}`}
          variant={isSelected ? "default" : "outline"}
          className={`h-auto py-2 justify-start ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => toggleTimeSlot(startTime, endTime)}
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>
            {format(new Date(`2000-01-01T${startTime}`), "h:mm a")} -{" "}
            {format(new Date(`2000-01-01T${endTime}`), "h:mm a")}
          </span>
        </Button>,
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">{rows}</div>
    );
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Availability Schedule</span>
          {isLoading && (
            <span className="text-sm text-muted-foreground">Syncing...</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="calendar"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />

                <div className="mt-4 flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={isAvailable}
                    onCheckedChange={setDayAvailability}
                  />
                  <Label htmlFor="available">
                    {isAvailable
                      ? "Available on this day"
                      : "Not available on this day"}
                  </Label>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">
                    {format(date, "EEEE, MMMM d, yyyy")}
                  </h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      {getTimeSlotsForDate(date).length} time slots available
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2">
                <h3 className="text-sm font-medium mb-2">
                  Select Available Time Slots
                </h3>
                {isAvailable ? (
                  renderTimeSlotGrid()
                ) : (
                  <div className="p-4 border rounded-md text-center text-gray-500">
                    Mark this day as available to select time slots
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Upcoming Bookings</h3>
              {getUpcomingBookings().length > 0 ? (
                getUpcomingBookings().map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium">
                          {format(new Date(booking.date), "EEEE, MMMM d, yyyy")}
                        </span>
                        {booking.recurring && booking.recurring !== "none" && (
                          <Badge variant="outline" className="ml-2">
                            <Repeat className="h-3 w-3 mr-1" />
                            {booking.recurring === "weekly"
                              ? "Weekly"
                              : booking.recurring === "biweekly"
                                ? "Bi-weekly"
                                : "Monthly"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>
                          {format(
                            new Date(`2000-01-01T${booking.startTime}`),
                            "h:mm a",
                          )}{" "}
                          -{" "}
                          {format(
                            new Date(`2000-01-01T${booking.endTime}`),
                            "h:mm a",
                          )}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Service ID: {booking.serviceId || "Not assigned"}
                      </div>
                      {booking.notes && (
                        <div className="mt-1 text-sm text-gray-500">
                          Notes: {booking.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Check className="h-4 w-4 mr-1" /> Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                      >
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 border rounded-md text-center text-gray-500">
                  No upcoming bookings
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Availability Preferences
                </h3>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="recurringPattern">Recurring Pattern</Label>
                    <Select
                      value={recurringPattern}
                      onValueChange={(
                        value: "none" | "weekly" | "biweekly" | "monthly",
                      ) => setRecurringPattern(value)}
                      disabled={readOnly}
                    >
                      <SelectTrigger id="recurringPattern">
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">One-time only</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {recurringPattern !== "none" && (
                    <div className="grid gap-2">
                      <Label htmlFor="recurrenceEndDate">
                        Recurrence End Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                            disabled={readOnly}
                          >
                            {recurrenceEndDate ? (
                              format(recurrenceEndDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={recurrenceEndDate}
                            onSelect={(date) =>
                              date && setRecurrenceEndDate(date)
                            }
                            disabled={(date) => isBefore(date, new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="bufferBefore">
                      Buffer Time Before (minutes)
                    </Label>
                    <Select
                      value={bufferBefore.toString()}
                      onValueChange={(value) =>
                        setBufferBefore(parseInt(value))
                      }
                      disabled={readOnly}
                    >
                      <SelectTrigger id="bufferBefore">
                        <SelectValue placeholder="Select buffer time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No buffer</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bufferAfter">
                      Buffer Time After (minutes)
                    </Label>
                    <Select
                      value={bufferAfter.toString()}
                      onValueChange={(value) => setBufferAfter(parseInt(value))}
                      disabled={readOnly}
                    >
                      <SelectTrigger id="bufferAfter">
                        <SelectValue placeholder="Select buffer time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No buffer</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes (visible to admin only)</Label>
                    <textarea
                      id="notes"
                      className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add any notes about your availability"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={readOnly}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Notifications</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for new bookings
                      </p>
                    </div>
                    <Switch id="emailNotifications" disabled={readOnly} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications for new bookings
                      </p>
                    </div>
                    <Switch id="pushNotifications" disabled={readOnly} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminderNotifications">
                        Booking Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive reminders before scheduled bookings
                      </p>
                    </div>
                    <Switch id="reminderNotifications" disabled={readOnly} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HelperAvailabilityCalendar;
