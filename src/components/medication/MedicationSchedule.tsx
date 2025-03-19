import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Clock, Calendar as CalendarIcon, Plus } from "lucide-react";
import MedicationReminderCard, {
  MedicationReminder,
} from "./MedicationReminderCard";

interface MedicationScheduleProps {
  reminders: MedicationReminder[];
  onAddMedication?: () => void;
  onMarkTaken: (id: string) => void;
  onMarkMissed: (id: string) => void;
  onSnooze: (id: string) => void;
  className?: string;
}

const MedicationSchedule = ({
  reminders: initialReminders,
  onAddMedication = () => {},
  onMarkTaken,
  onMarkMissed,
  onSnooze,
  className = "",
}: MedicationScheduleProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reminders, setReminders] =
    useState<MedicationReminder[]>(initialReminders);

  // Filter reminders by status
  const upcomingReminders = reminders.filter(
    (reminder) =>
      reminder.status === "upcoming" || reminder.status === "overdue",
  );
  const takenReminders = reminders.filter(
    (reminder) => reminder.status === "taken",
  );
  const missedReminders = reminders.filter(
    (reminder) => reminder.status === "missed",
  );

  // Group reminders by time
  const groupedReminders = upcomingReminders.reduce<
    Record<string, MedicationReminder[]>
  >((acc, reminder) => {
    if (!acc[reminder.time]) {
      acc[reminder.time] = [];
    }
    acc[reminder.time].push(reminder);
    return acc;
  }, {});

  // Sort times
  const sortedTimes = Object.keys(groupedReminders).sort((a, b) => {
    const timeA = new Date(`1970/01/01 ${a}`).getTime();
    const timeB = new Date(`1970/01/01 ${b}`).getTime();
    return timeA - timeB;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Medication Schedule</h2>
        <Button onClick={onAddMedication}>
          <Plus className="h-4 w-4 mr-2" /> Add Medication
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full"
            />
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Upcoming ({upcomingReminders.length})
              </TabsTrigger>
              <TabsTrigger value="taken" className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Taken ({takenReminders.length})
              </TabsTrigger>
              <TabsTrigger value="missed" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Missed ({missedReminders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4 space-y-6">
              {sortedTimes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming medications for today
                </div>
              ) : (
                sortedTimes.map((time) => (
                  <div key={time} className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {time}
                    </h3>
                    <div className="space-y-3">
                      {groupedReminders[time].map((reminder) => (
                        <MedicationReminderCard
                          key={reminder.id}
                          reminder={reminder}
                          onMarkTaken={onMarkTaken}
                          onMarkMissed={onMarkMissed}
                          onSnooze={onSnooze}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="taken" className="mt-4">
              <div className="space-y-3">
                {takenReminders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No medications taken today
                  </div>
                ) : (
                  takenReminders.map((reminder) => (
                    <MedicationReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onMarkTaken={onMarkTaken}
                      onMarkMissed={onMarkMissed}
                      onSnooze={onSnooze}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="missed" className="mt-4">
              <div className="space-y-3">
                {missedReminders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No missed medications
                  </div>
                ) : (
                  missedReminders.map((reminder) => (
                    <MedicationReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onMarkTaken={onMarkTaken}
                      onMarkMissed={onMarkMissed}
                      onSnooze={onSnooze}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MedicationSchedule;
