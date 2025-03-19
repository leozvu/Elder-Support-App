import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pill, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  adherence: number;
  lastTaken: string;
  nextDose: string;
  status: "taken" | "missed" | "upcoming" | "overdue";
}

interface MedicationMonitoringProps {
  seniorId: string;
  onSendReminder?: (medicationId: string) => void;
}

const MedicationMonitoring = ({
  seniorId,
  onSendReminder,
}: MedicationMonitoringProps) => {
  const { toast } = useToast();

  // Mock data - in a real app, this would come from the database
  const medications: Medication[] = [
    {
      id: "med1",
      name: "Lisinopril",
      dosage: "10mg",
      schedule: "Daily, 8:00 AM",
      adherence: 92,
      lastTaken: "Today, 8:05 AM",
      nextDose: "Tomorrow, 8:00 AM",
      status: "taken",
    },
    {
      id: "med2",
      name: "Metformin",
      dosage: "500mg",
      schedule: "Twice daily",
      adherence: 85,
      lastTaken: "Today, 12:30 PM",
      nextDose: "Today, 8:00 PM",
      status: "upcoming",
    },
    {
      id: "med3",
      name: "Simvastatin",
      dosage: "20mg",
      schedule: "Daily, 9:00 PM",
      adherence: 78,
      lastTaken: "Yesterday, 9:15 PM",
      nextDose: "Today, 9:00 PM",
      status: "upcoming",
    },
    {
      id: "med4",
      name: "Aspirin",
      dosage: "81mg",
      schedule: "Daily, 12:00 PM",
      adherence: 65,
      lastTaken: "2 days ago",
      nextDose: "Today, 12:00 PM",
      status: "overdue",
    },
  ];

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return "bg-green-500";
    if (adherence >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "taken":
        return <Badge className="bg-green-100 text-green-800">Taken</Badge>;
      case "missed":
        return <Badge variant="destructive">Missed</Badge>;
      case "upcoming":
        return (
          <Badge variant="outline" className="text-blue-500">
            Upcoming
          </Badge>
        );
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "missed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "upcoming":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const handleSendReminder = (medicationId: string) => {
    const medication = medications.find((med) => med.id === medicationId);

    if (onSendReminder) {
      onSendReminder(medicationId);
    }

    toast({
      title: "Reminder Sent",
      description: `Reminder for ${medication?.name} has been sent.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Medication Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medications.map((medication) => (
            <div key={medication.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {getStatusIcon(medication.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{medication.name}</h3>
                      {getStatusBadge(medication.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {medication.dosage} - {medication.schedule}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {medication.status === "taken"
                      ? "Last taken:"
                      : medication.status === "upcoming" ||
                          medication.status === "overdue"
                        ? "Next dose:"
                        : "Missed:"}
                  </p>
                  <p className="text-sm">
                    {medication.status === "taken"
                      ? medication.lastTaken
                      : medication.status === "upcoming" ||
                          medication.status === "overdue"
                        ? medication.nextDose
                        : medication.nextDose}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs">Adherence</p>
                  <p className="text-xs font-medium">{medication.adherence}%</p>
                </div>
                <Progress
                  value={medication.adherence}
                  className={`h-1.5 ${getAdherenceColor(medication.adherence)}`}
                />
              </div>

              {(medication.status === "upcoming" ||
                medication.status === "overdue") && (
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSendReminder(medication.id)}
                  >
                    Send Reminder
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationMonitoring;
