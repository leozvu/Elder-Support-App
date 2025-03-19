import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Clock,
  CheckCircle,
  Users,
  Star,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface HubPerformanceMetricsProps {
  hubId?: string;
  timeRange?: "day" | "week" | "month" | "quarter" | "year";
}

// Mock data - in a real app, this would come from an API
const mockServiceCompletionData = [
  { name: "Mon", completed: 12, cancelled: 2, total: 15 },
  { name: "Tue", completed: 15, cancelled: 1, total: 18 },
  { name: "Wed", completed: 18, cancelled: 3, total: 22 },
  { name: "Thu", completed: 14, cancelled: 2, total: 17 },
  { name: "Fri", completed: 20, cancelled: 1, total: 22 },
  { name: "Sat", completed: 10, cancelled: 0, total: 10 },
  { name: "Sun", completed: 8, cancelled: 1, total: 9 },
];

const mockResponseTimeData = [
  { name: "Mon", time: 12 },
  { name: "Tue", time: 10 },
  { name: "Wed", time: 8 },
  { name: "Thu", time: 15 },
  { name: "Fri", time: 9 },
  { name: "Sat", time: 11 },
  { name: "Sun", time: 13 },
];

const mockSatisfactionData = [
  { name: "5 Stars", value: 45 },
  { name: "4 Stars", value: 30 },
  { name: "3 Stars", value: 15 },
  { name: "2 Stars", value: 7 },
  { name: "1 Star", value: 3 },
];

const mockServiceTypeData = [
  { name: "Shopping", value: 35 },
  { name: "Medical", value: 25 },
  { name: "Companionship", value: 20 },
  { name: "Transportation", value: 15 },
  { name: "Home Assistance", value: 5 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF6B6B",
];

const HubPerformanceMetrics: React.FC<HubPerformanceMetricsProps> = ({
  hubId,
  timeRange = "week",
}) => {
  const [activeTab, setActiveTab] = React.useState("overview");

  // Calculate KPIs
  const completionRate =
    (mockServiceCompletionData.reduce((acc, curr) => acc + curr.completed, 0) /
      mockServiceCompletionData.reduce((acc, curr) => acc + curr.total, 0)) *
    100;

  const avgResponseTime = Math.round(
    mockResponseTimeData.reduce((acc, curr) => acc + curr.time, 0) /
      mockResponseTimeData.length,
  );

  const avgSatisfaction =
    (mockSatisfactionData.reduce(
      (acc, curr) => acc + curr.value * parseInt(curr.name.charAt(0)),
      0,
    ) /
      mockSatisfactionData.reduce((acc, curr) => acc + curr.value, 0)) *
    20; // Convert to percentage (1-5 scale to 0-100)

  const activeHelpers = 28; // Mock data
  const totalRequests = mockServiceCompletionData.reduce(
    (acc, curr) => acc + curr.total,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-3xl font-bold">
                  {completionRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress
              value={completionRate}
              className="h-2 mt-4"
              indicatorClassName="bg-green-600"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Response Time</p>
                <p className="text-3xl font-bold">{avgResponseTime} min</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress
              value={100 - (avgResponseTime / 30) * 100} // Lower is better
              className="h-2 mt-4"
              indicatorClassName="bg-blue-600"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">User Satisfaction</p>
                <p className="text-3xl font-bold">
                  {avgSatisfaction.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <Progress
              value={avgSatisfaction}
              className="h-2 mt-4"
              indicatorClassName="bg-yellow-600"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-3xl font-bold">{totalRequests}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">Active Helpers</p>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-500 mr-1" />
                <span className="font-medium">{activeHelpers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="completion">Service Completion</TabsTrigger>
          <TabsTrigger value="response">Response Time</TabsTrigger>
          <TabsTrigger value="satisfaction">User Satisfaction</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Service Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockServiceCompletionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="completed"
                        stackId="a"
                        fill="#4ade80"
                        name="Completed"
                      />
                      <Bar
                        dataKey="cancelled"
                        stackId="a"
                        fill="#f87171"
                        name="Cancelled"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Average Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockResponseTimeData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="time"
                        stroke="#3b82f6"
                        name="Minutes"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="completion" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Completion Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockServiceCompletionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="completed"
                        fill="#4ade80"
                        name="Completed"
                      />
                      <Bar
                        dataKey="cancelled"
                        fill="#f87171"
                        name="Cancelled"
                      />
                      <Bar dataKey="total" fill="#60a5fa" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockServiceTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockServiceTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockResponseTimeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="#3b82f6"
                      name="Response Time (minutes)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Satisfaction Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockSatisfactionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockSatisfactionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Rating Breakdown
                    </h3>
                    <div className="space-y-3">
                      {mockSatisfactionData.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span>{item.name}</span>
                            <span>
                              {(
                                (item.value /
                                  mockSatisfactionData.reduce(
                                    (acc, curr) => acc + curr.value,
                                    0,
                                  )) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              (item.value /
                                mockSatisfactionData.reduce(
                                  (acc, curr) => acc + curr.value,
                                  0,
                                )) *
                              100
                            }
                            className="h-2"
                            indicatorClassName={`bg-${COLORS[index % COLORS.length]}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Satisfaction Insights
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <span>
                          {avgSatisfaction.toFixed(1)}% overall satisfaction
                          rate
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>
                          3.5% increase in satisfaction compared to last{" "}
                          {timeRange}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                        <span>
                          75% of users rated their experience 4 stars or higher
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HubPerformanceMetrics;
