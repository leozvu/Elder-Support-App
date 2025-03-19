import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  HeartPulse,
  Calendar,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Activity,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WellnessCheck {
  id: string;
  date: string;
  status: "pending" | "completed" | "missed" | "overdue" | "upcoming";
  questions: WellnessQuestion[];
  responses?: WellnessResponse[];
  type?: string;
  frequency?: string;
  lastCompleted?: string;
  nextDue?: string;
}

interface WellnessQuestion {
  id: string;
  text: string;
  type: "scale" | "yesno" | "text";
}

interface WellnessResponse {
  questionId: string;
  response: string | number;
}

interface WellnessMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  target?: {
    min?: number;
    max?: number;
  };
  trend: "up" | "down" | "stable";
}

interface WellnessCheckSystemProps {
  wellnessChecks?: WellnessCheck[];
  wellnessMetrics?: WellnessMetric[];
  onCompleteCheck?: (
    id: string,
    responses: Record<string, string | number>,
  ) => void;
  onAddMetric?: (metric: Omit<WellnessMetric, "id" | "trend">) => void;
}

const WellnessCheckSystem = ({
  wellnessChecks: initialChecks,
  wellnessMetrics: initialMetrics,
  onCompleteCheck = () => {},
  onAddMetric = () => {},
}: WellnessCheckSystemProps = {}) => {
  const [wellnessChecks, setWellnessChecks] = useState<WellnessCheck[]>(
    initialChecks || [
      {
        id: "1",
        date: new Date().toISOString(),
        status: "pending",
        questions: [
          {
            id: "q1",
            text: "How are you feeling today?",
            type: "scale",
          },
          {
            id: "q2",
            text: "Did you take all your medications today?",
            type: "yesno",
          },
          {
            id: "q3",
            text: "Have you eaten regular meals today?",
            type: "yesno",
          },
          {
            id: "q4",
            text: "Is there anything you need help with today?",
            type: "text",
          },
        ],
      },
      {
        id: "2",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        status: "completed",
        questions: [
          {
            id: "q1",
            text: "How are you feeling today?",
            type: "scale",
          },
          {
            id: "q2",
            text: "Did you take all your medications today?",
            type: "yesno",
          },
          {
            id: "q3",
            text: "Have you eaten regular meals today?",
            type: "yesno",
          },
          {
            id: "q4",
            text: "Is there anything you need help with today?",
            type: "text",
          },
        ],
        responses: [
          { questionId: "q1", response: 4 },
          { questionId: "q2", response: "yes" },
          { questionId: "q3", response: "yes" },
          { questionId: "q4", response: "No, everything is fine today." },
        ],
      },
    ],
  );

  const [metrics, setMetrics] = useState<WellnessMetric[]>(
    initialMetrics || [
      {
        id: "1",
        name: "Blood Pressure",
        value: 128,
        unit: "mmHg",
        date: "2023-05-15",
        target: {
          min: 110,
          max: 130,
        },
        trend: "stable",
      },
      {
        id: "2",
        name: "Weight",
        value: 165,
        unit: "lbs",
        date: "2023-05-15",
        target: {
          min: 160,
          max: 175,
        },
        trend: "down",
      },
      {
        id: "3",
        name: "Blood Sugar",
        value: 110,
        unit: "mg/dL",
        date: "2023-05-15",
        target: {
          min: 80,
          max: 130,
        },
        trend: "up",
      },
    ],
  );

  const [isCheckDialogOpen, setIsCheckDialogOpen] = useState(false);
  const [currentCheck, setCurrentCheck] = useState<WellnessCheck | null>(null);
  const [currentResponses, setCurrentResponses] = useState<WellnessResponse[]>(
    [],
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMetricDialogOpen, setIsMetricDialogOpen] = useState(false);
  const [newMetric, setNewMetric] = useState({
    name: "",
    value: "",
    unit: "",
    date: new Date().toISOString().split("T")[0],
  });

  const startWellnessCheck = (check: WellnessCheck) => {
    setCurrentCheck(check);
    setCurrentResponses([]);
    setCurrentQuestionIndex(0);
    setIsCheckDialogOpen(true);
  };

  const handleResponse = (response: string | number) => {
    if (!currentCheck) return;

    const currentQuestion = currentCheck.questions[currentQuestionIndex];
    const updatedResponses = [...currentResponses];
    const existingResponseIndex = updatedResponses.findIndex(
      (r) => r.questionId === currentQuestion.id,
    );

    if (existingResponseIndex >= 0) {
      updatedResponses[existingResponseIndex].response = response;
    } else {
      updatedResponses.push({
        questionId: currentQuestion.id,
        response,
      });
    }

    setCurrentResponses(updatedResponses);

    // Move to next question or complete check
    if (currentQuestionIndex < currentCheck.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeWellnessCheck(updatedResponses);
    }
  };

  const completeWellnessCheck = (responses: WellnessResponse[]) => {
    if (!currentCheck) return;

    const updatedChecks = wellnessChecks.map((check) => {
      if (check.id === currentCheck.id) {
        return {
          ...check,
          status: "completed" as const,
          responses,
        };
      }
      return check;
    });

    setWellnessChecks(updatedChecks);
    setIsCheckDialogOpen(false);
    setCurrentCheck(null);

    // Convert responses to Record format for the callback
    const responsesRecord: Record<string, string | number> = {};
    responses.forEach((r) => {
      const question = currentCheck.questions.find(
        (q) => q.id === r.questionId,
      );
      if (question) {
        responsesRecord[question.text] = r.response;
      }
    });

    onCompleteCheck(currentCheck.id, responsesRecord);
  };

  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMetric((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMetric = () => {
    const metric = {
      name: newMetric.name,
      value: parseFloat(newMetric.value),
      unit: newMetric.unit,
      date: newMetric.date,
    };

    // Find previous metric to determine trend
    const previousMetric = metrics.find((m) => m.name === metric.name);
    const trend = previousMetric
      ? metric.value > previousMetric.value
        ? "up"
        : metric.value < previousMetric.value
          ? "down"
          : "stable"
      : "stable";

    const newMetricWithId: WellnessMetric = {
      id: Date.now().toString(),
      ...metric,
      trend: trend as "up" | "down" | "stable",
    };

    setMetrics([newMetricWithId, ...metrics]);
    onAddMetric(metric);
    setIsMetricDialogOpen(false);
    setNewMetric({
      name: "",
      value: "",
      unit: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "overdue":
      case "missed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "upcoming":
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "overdue":
      case "missed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return (
          <span className="text-green-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        );
      case "down":
        return (
          <span className="text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.966.364l-4.285-1.81a.75.75 0 01.483-1.425l3.38 1.431A19.41 19.41 0 007.863 7.24l-3.867 3.867L.222 7.222a.75.75 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        );
      case "stable":
        return (
          <span className="text-gray-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        );
      default:
        return null;
    }
  };

  const getMetricProgress = (metric: WellnessMetric) => {
    if (!metric.target || (!metric.target.min && !metric.target.max)) return 50;

    if (metric.target.min && metric.target.max) {
      const range = metric.target.max - metric.target.min;
      const position = metric.value - metric.target.min;
      return Math.min(Math.max((position / range) * 100, 0), 100);
    }

    if (metric.target.min && !metric.target.max) {
      return metric.value >= metric.target.min
        ? 100
        : (metric.value / metric.target.min) * 100;
    }

    if (!metric.target.min && metric.target.max) {
      return metric.value <= metric.target.max
        ? 50
        : 100 - (metric.value / metric.target.max) * 50;
    }

    return 50;
  };

  const isMetricInRange = (metric: WellnessMetric) => {
    if (!metric.target) return true;

    const minOk = metric.target.min ? metric.value >= metric.target.min : true;
    const maxOk = metric.target.max ? metric.value <= metric.target.max : true;

    return minOk && maxOk;
  };

  const renderQuestion = () => {
    if (!currentCheck) return null;

    const question = currentCheck.questions[currentQuestionIndex];
    const progress =
      ((currentQuestionIndex + 1) / currentCheck.questions.length) * 100;

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              Question {currentQuestionIndex + 1} of{" "}
              {currentCheck.questions.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <h3 className="text-lg font-medium mt-4">{question.text}</h3>

        {question.type === "scale" && (
          <div className="py-4">
            <RadioGroup
              defaultValue="4"
              className="flex justify-between space-x-2"
              onValueChange={(value) => handleResponse(parseInt(value))}
            >
              <div className="flex flex-col items-center space-y-1">
                <RadioGroupItem value="1" id="r1" className="peer sr-only" />
                <Label
                  htmlFor="r1"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <ThumbsDown className="mb-3 h-6 w-6 text-red-500" />
                  <span>Poor</span>
                </Label>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RadioGroupItem value="2" id="r2" className="peer sr-only" />
                <Label
                  htmlFor="r2"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <span className="text-2xl">😐</span>
                  <span>Fair</span>
                </Label>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RadioGroupItem value="3" id="r3" className="peer sr-only" />
                <Label
                  htmlFor="r3"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <span className="text-2xl">🙂</span>
                  <span>Good</span>
                </Label>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RadioGroupItem value="4" id="r4" className="peer sr-only" />
                <Label
                  htmlFor="r4"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <span className="text-2xl">😀</span>
                  <span>Great</span>
                </Label>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RadioGroupItem value="5" id="r5" className="peer sr-only" />
                <Label
                  htmlFor="r5"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <ThumbsUp className="mb-3 h-6 w-6 text-green-500" />
                  <span>Excellent</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {question.type === "yesno" && (
          <div className="py-4">
            <RadioGroup
              defaultValue="yes"
              className="flex space-x-4"
              onValueChange={(value) => handleResponse(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {question.type === "text" && (
          <div className="py-4">
            <Textarea
              placeholder="Type your answer here..."
              className="min-h-[100px]"
              onChange={(e) => handleResponse(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button onClick={() => handleResponse("")}>Next</Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="checks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="checks" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Wellness Checks
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Health Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checks" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Scheduled Checks</h3>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </div>

          <div className="space-y-3">
            {wellnessChecks.map((check) => (
              <Card key={check.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {check.type || "Wellness Check"}
                        </h4>
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
                      <div className="text-sm text-gray-500 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{" "}
                          {check.frequency || "Daily"}
                        </span>
                        {check.lastCompleted && (
                          <span>Last: {formatDate(check.lastCompleted)}</span>
                        )}
                        {check.nextDue && (
                          <span>Next: {formatDate(check.nextDue)}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => startWellnessCheck(check)}
                      variant={
                        check.status === "overdue" || check.status === "missed"
                          ? "destructive"
                          : "default"
                      }
                      size="sm"
                    >
                      Complete Check
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Health Metrics</h3>
            <Dialog
              open={isMetricDialogOpen}
              onOpenChange={setIsMetricDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Add Metric
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Health Metric</DialogTitle>
                  <DialogDescription>
                    Record a new health measurement to track your wellness.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="metric-name">Metric</Label>
                    <select
                      id="metric-name"
                      name="name"
                      value={newMetric.name}
                      onChange={(e) =>
                        setNewMetric({ ...newMetric, name: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="" disabled>
                        Select a metric
                      </option>
                      <option value="Blood Pressure">Blood Pressure</option>
                      <option value="Weight">Weight</option>
                      <option value="Blood Sugar">Blood Sugar</option>
                      <option value="Steps">Steps</option>
                      <option value="Heart Rate">Heart Rate</option>
                      <option value="Temperature">Temperature</option>
                      <option value="Oxygen Level">Oxygen Level</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="metric-value">Value</Label>
                      <Input
                        id="metric-value"
                        name="value"
                        type="number"
                        value={newMetric.value}
                        onChange={handleMetricChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metric-unit">Unit</Label>
                      <Input
                        id="metric-unit"
                        name="unit"
                        value={newMetric.unit}
                        onChange={handleMetricChange}
                        placeholder="e.g., mmHg, lbs, mg/dL"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metric-date">Date</Label>
                    <Input
                      id="metric-date"
                      name="date"
                      type="date"
                      value={newMetric.date}
                      onChange={handleMetricChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsMetricDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddMetric}>Add Metric</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{metric.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(metric.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-lg font-semibold ${!isMetricInRange(metric) ? "text-red-600" : ""}`}
                      >
                        {metric.value} {metric.unit}
                      </span>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>

                  {metric.target && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        {metric.target.min !== undefined && (
                          <span>Min: {metric.target.min}</span>
                        )}
                        {metric.target.max !== undefined && (
                          <span>Max: {metric.target.max}</span>
                        )}
                      </div>
                      <Progress
                        value={getMetricProgress(metric)}
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isCheckDialogOpen} onOpenChange={setIsCheckDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Daily Wellness Check</DialogTitle>
            <DialogDescription>
              Please answer the following questions about how you're feeling
              today.
            </DialogDescription>
          </DialogHeader>
          {renderQuestion()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WellnessCheckSystem;
