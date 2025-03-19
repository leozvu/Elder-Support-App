import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Bell, Check, Pill } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  instructions?: string;
  nextDose?: string;
  isCompleted?: boolean;
}

interface MedicationReminderCardProps {
  medications?: Medication[];
  onMarkTaken?: (id: string) => void;
  onAddMedication?: () => void;
  className?: string;
}

const MedicationReminderCard = ({
  medications = [
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timeOfDay: ["Morning"],
      instructions: "Take with food",
      nextDose: "8:00 AM",
      isCompleted: false,
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      timeOfDay: ["Morning", "Evening"],
      instructions: "Take with meals",
      nextDose: "8:00 AM",
      isCompleted: false,
    },
    {
      id: "3",
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      timeOfDay: ["Morning"],
      nextDose: "8:00 AM",
      isCompleted: true,
    },
  ],
  onMarkTaken = (id) => {},
  onAddMedication = () => {},
  className = "",
}: MedicationReminderCardProps) => {
  // Filter medications for today's doses
  const upcomingMedications = medications.filter((med) => !med.isCompleted);
  const completedMedications = medications.filter((med) => med.isCompleted);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold">
          Medication Reminders
        </CardTitle>
        <Button onClick={onAddMedication} className="h-8 px-2">
          Add Medication
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingMedications.length === 0 &&
        completedMedications.length === 0 ? (
          <div className="text-center py-6">
            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg text-muted-foreground">
              No medications scheduled. Add your first medication to get
              started.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingMedications.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Upcoming Doses</h3>
                <div className="space-y-3">
                  {upcomingMedications.map((medication) => (
                    <div
                      key={medication.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Pill className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{medication.name}</h4>
                            <Badge variant="outline">{medication.dosage}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {medication.frequency} • {medication.instructions}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-amber-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">
                            {medication.nextDose}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onMarkTaken(medication.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Mark Taken
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedMedications.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Completed Today</h3>
                <div className="space-y-2">
                  {completedMedications.map((medication) => (
                    <div
                      key={medication.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 opacity-70"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{medication.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            {medication.dosage} • {medication.frequency}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50">
                        Taken
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationReminderCard;
