import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Clock,
  Calendar as CalendarIcon,
  Plus,
  Activity,
} from "lucide-react";
import WellnessCheckCard, { WellnessCheck } from "./WellnessCheckCard";

interface WellnessTrackerProps {
  checks: WellnessCheck[];
  onAddCheck?: () => void;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  onReschedule: (id: string) => void;
  className?: string;
}

const WellnessTracker = ({
  checks: initialChecks,
  onAddCheck = () => {},
  onComplete,
  onSkip,
  onReschedule,
  className = "",
}: WellnessTrackerProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [checks, setChecks] = useState<WellnessCheck[]>(initialChecks);

  // Filter checks by status
  const upcomingChecks = checks.filter(
    (check) => check.status === "upcoming" || check.status === "overdue",
  );
  const completedChecks = checks.filter(
    (check) => check.status === "completed",
  );
  const missedChecks = checks.filter((check) => check.status === "missed");

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Wellness Tracker</h2>
        <Button onClick={onAddCheck}>
          <Plus className="h-4 w-4 mr-2" /> Add Check
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4 space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full"
            />

            <div className="space-y-3 pt-4">
              <h3 className="font-medium">Wellness Summary</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 rounded-md">
                  <div className="text-2xl font-bold text-blue-600">
                    {upcomingChecks.length}
                  </div>
                  <div className="text-xs text-blue-600">Upcoming</div>
                </div>
                <div className="p-2 bg-green-50 rounded-md">
                  <div className="text-2xl font-bold text-green-600">
                    {completedChecks.length}
                  </div>
                  <div className="text-xs text-green-600">Completed</div>
                </div>
                <div className="p-2 bg-red-50 rounded-md">
                  <div className="text-2xl font-bold text-red-600">
                    {missedChecks.length}
                  </div>
                  <div className="text-xs text-red-600">Missed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Upcoming ({upcomingChecks.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Completed ({completedChecks.length})
              </TabsTrigger>
              <TabsTrigger value="missed" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Missed ({missedChecks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4">
              <div className="space-y-3">
                {upcomingChecks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming wellness checks
                  </div>
                ) : (
                  upcomingChecks.map((check) => (
                    <WellnessCheckCard
                      key={check.id}
                      check={check}
                      onComplete={onComplete}
                      onSkip={onSkip}
                      onReschedule={onReschedule}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <div className="space-y-3">
                {completedChecks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No completed wellness checks
                  </div>
                ) : (
                  completedChecks.map((check) => (
                    <WellnessCheckCard
                      key={check.id}
                      check={check}
                      onComplete={onComplete}
                      onSkip={onSkip}
                      onReschedule={onReschedule}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="missed" className="mt-4">
              <div className="space-y-3">
                {missedChecks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No missed wellness checks
                  </div>
                ) : (
                  missedChecks.map((check) => (
                    <WellnessCheckCard
                      key={check.id}
                      check={check}
                      onComplete={onComplete}
                      onSkip={onSkip}
                      onReschedule={onReschedule}
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

export default WellnessTracker;
