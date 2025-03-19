import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Clock, Pill, AlertCircle, Check, X } from "lucide-react";
import { db } from "@/lib/local-database";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes?: string;
  lastTaken?: string;
  nextDue?: string;
}

const MedicationReminderSystem = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Blood Pressure Medication",
      dosage: "10mg",
      frequency: "daily",
      time: "08:00",
      notes: "Take with food",
      lastTaken: "2023-05-13T08:05:00",
      nextDue: "2023-05-14T08:00:00",
    },
    {
      id: "2",
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "daily",
      time: "09:00",
      lastTaken: "2023-05-13T09:10:00",
      nextDue: "2023-05-14T09:00:00",
    },
    {
      id: "3",
      name: "Arthritis Medication",
      dosage: "20mg",
      frequency: "twice-daily",
      time: "08:00,20:00",
      notes: "Take with plenty of water",
      lastTaken: "2023-05-13T20:00:00",
      nextDue: "2023-05-14T08:00:00",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: "",
    dosage: "",
    frequency: "daily",
    time: "08:00",
    notes: "",
  });

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) return;

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency || "daily",
      time: newMedication.time || "08:00",
      notes: newMedication.notes,
      lastTaken: "",
      nextDue: new Date().toISOString(),
    };

    setMedications([...medications, medication]);
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "daily",
      time: "08:00",
      notes: "",
    });
    setIsAddDialogOpen(false);

    // In a real app, we would save to the database
    // db.insert("medications", medication);
  };

  const handleTakeMedication = (id: string) => {
    const now = new Date();
    const updatedMedications = medications.map((med) => {
      if (med.id === id) {
        // Calculate next due time based on frequency
        let nextDue = new Date(now);
        if (med.frequency === "daily") {
          nextDue.setDate(nextDue.getDate() + 1);
        } else if (med.frequency === "twice-daily") {
          // If morning dose, set to evening; if evening, set to next morning
          const [morningTime, eveningTime] = med.time.split(",");
          const currentHour = now.getHours();
          if (currentHour < 12 && eveningTime) {
            // It's morning dose, next is evening
            const [eveningHour, eveningMinute] = eveningTime.split(":");
            nextDue.setHours(parseInt(eveningHour), parseInt(eveningMinute));
          } else {
            // It's evening dose or there's only one time, next is tomorrow morning
            nextDue.setDate(nextDue.getDate() + 1);
            const [morningHour, morningMinute] = morningTime.split(":");
            nextDue.setHours(parseInt(morningHour), parseInt(morningMinute));
          }
        } else if (med.frequency === "weekly") {
          nextDue.setDate(nextDue.getDate() + 7);
        }

        return {
          ...med,
          lastTaken: now.toISOString(),
          nextDue: nextDue.toISOString(),
        };
      }
      return med;
    });

    setMedications(updatedMedications);

    // In a real app, we would update the database
    // db.update("medications", { id, lastTaken: now.toISOString(), nextDue: nextDue.toISOString() });
  };

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "Not taken yet";
    const date = new Date(dateTimeStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isMedicationDue = (nextDue: string | undefined) => {
    if (!nextDue) return false;
    const now = new Date();
    const dueTime = new Date(nextDue);
    return now >= dueTime;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Medication Reminders</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>
                Enter the details of your medication below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMedication.name}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">
                  Dosage
                </Label>
                <Input
                  id="dosage"
                  value={newMedication.dosage}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      dosage: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Select
                  value={newMedication.frequency}
                  onValueChange={(value) =>
                    setNewMedication({
                      ...newMedication,
                      frequency: value,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Once daily</SelectItem>
                    <SelectItem value="twice-daily">Twice daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="as-needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newMedication.time}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      time: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={newMedication.notes}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      notes: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddMedication}>
                Add Medication
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medications.map((medication) => (
          <Card
            key={medication.id}
            className={`${isMedicationDue(medication.nextDue) ? "border-red-400" : ""}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    {medication.name}
                  </CardTitle>
                  <CardDescription>{medication.dosage}</CardDescription>
                </div>
                {isMedicationDue(medication.nextDue) && (
                  <div className="bg-red-100 text-red-800 p-1 rounded-full">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>
                    {medication.frequency === "daily"
                      ? "Once daily"
                      : medication.frequency === "twice-daily"
                        ? "Twice daily"
                        : medication.frequency === "weekly"
                          ? "Weekly"
                          : "As needed"}
                    {medication.time &&
                      ` at ${medication.time.replace(",", " and ")}`}
                  </span>
                </div>
                {medication.notes && (
                  <div className="text-gray-600">{medication.notes}</div>
                )}
                <div className="pt-2">
                  <div className="text-xs text-gray-500">
                    Last taken: {formatDateTime(medication.lastTaken || "")}
                  </div>
                  <div
                    className={`text-xs ${isMedicationDue(medication.nextDue) ? "text-red-600 font-bold" : "text-gray-500"}`}
                  >
                    Next due: {formatDateTime(medication.nextDue || "")}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={
                  isMedicationDue(medication.nextDue) ? "default" : "outline"
                }
                className="w-full"
                onClick={() => handleTakeMedication(medication.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark as Taken
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {medications.length === 0 && (
        <div className="text-center py-10">
          <Pill className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium">No medications added yet</h3>
          <p className="text-gray-500 mb-4">
            Add your medications to receive reminders
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            Add Medication
          </Button>
        </div>
      )}
    </div>
  );
};

export default MedicationReminderSystem;
