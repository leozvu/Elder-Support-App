import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  HeartPulse,
  Activity,
  Thermometer,
  Droplets,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WellnessMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  icon: React.ReactNode;
  lastUpdated?: string;
}

interface WellnessCheck {
  id: string;
  type: string;
  frequency: string;
  lastCompleted?: string;
  nextDue: string;
  status: "completed" | "upcoming" | "overdue";
}

interface WellnessCheckCardProps {
  metrics?: WellnessMetric[];
  upcomingChecks?: WellnessCheck[];
  lastCheckIn?: string;
  onCheckIn?: () => void;
  onStartCheck?: (check: WellnessCheck) => void;
  className?: string;
}

const WellnessCheckCard = ({
  metrics = [
    {
      id: "bp",
      name: "Blood Pressure",
      value: 120,
      unit: "mmHg",
      status: "normal",
      icon: <HeartPulse className="h-5 w-5" />,
      lastUpdated: "Today, 8:30 AM",
    },
    {
      id: "hr",
      name: "Heart Rate",
      value: 72,
      unit: "bpm",
      status: "normal",
      icon: <Activity className="h-5 w-5" />,
      lastUpdated: "Today, 8:30 AM",
    },
    {
      id: "temp",
      name: "Temperature",
      value: 98.6,
      unit: "°F",
      status: "normal",
      icon: <Thermometer className="h-5 w-5" />,
      lastUpdated: "Yesterday, 9:15 PM",
    },
    {
      id: "hydration",
      name: "Hydration",
      value: 70,
      unit: "%",
      status: "warning",
      icon: <Droplets className="h-5 w-5" />,
      lastUpdated: "Today, 8:30 AM",
    },
  ],
  upcomingChecks = [],
  lastCheckIn = "Today, 8:30 AM",
  onCheckIn = () => {},
  onStartCheck = () => {},
  className = "",
}: WellnessCheckCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-amber-600 bg-amber-100";
      case "critical":
        return "text-red-600 bg-red-100";
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-600";
      case "warning":
        return "bg-amber-600";
      case "critical":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Sort checks by status (overdue first, then upcoming) and then by date
  const sortedChecks = [...upcomingChecks].sort((a, b) => {
    if (a.status === "overdue" && b.status !== "overdue") return -1;
    if (a.status !== "overdue" && b.status === "overdue") return 1;

    const dateA = new Date(a.nextDue).getTime();
    const dateB = new Date(b.nextDue).getTime();
    return dateA - dateB;
  });

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold">Wellness Check</CardTitle>
        <Button onClick={onCheckIn}>Check In Now</Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Last check-in: <span className="font-medium">{lastCheckIn}</span>
          </p>
        </div>

        {sortedChecks.length > 0 && (
          <div className="mb-6 space-y-3">
            <h3 className="font-medium">Upcoming Checks</h3>
            {sortedChecks.slice(0, 2).map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{check.type}</h4>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(check.status)} border-0`}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(check.status)}
                        {check.status.charAt(0).toUpperCase() +
                          check.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Due: {formatDate(check.nextDue)}
                  </p>
                </div>
                <Button
                  onClick={() => onStartCheck(check)}
                  variant={
                    check.status === "overdue" ? "destructive" : "outline"
                  }
                  size="sm"
                >
                  Complete
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="p-4 border rounded-lg bg-card flex flex-col"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-full ${getStatusColor(metric.status)}`}
                  >
                    {metric.icon}
                  </div>
                  <h3 className="font-medium">{metric.name}</h3>
                </div>
                <span className="text-lg font-semibold">
                  {metric.value} {metric.unit}
                </span>
              </div>

              {metric.name === "Hydration" && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Hydration Level</span>
                    <span>{metric.value}%</span>
                  </div>
                  <Progress
                    value={metric.value}
                    className="h-2"
                    indicatorClassName={getProgressColor(metric.status)}
                  />
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {metric.lastUpdated}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Daily Wellness Tips</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Droplets className="h-4 w-4 text-blue-500 mt-0.5" />
              <span>Remember to drink at least 8 glasses of water today</span>
            </li>
            <li className="flex items-start gap-2">
              <Activity className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Try to take a 10-minute walk after lunch</span>
            </li>
            <li className="flex items-start gap-2">
              <HeartPulse className="h-4 w-4 text-red-500 mt-0.5" />
              <span>Take your blood pressure medication with breakfast</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessCheckCard;
