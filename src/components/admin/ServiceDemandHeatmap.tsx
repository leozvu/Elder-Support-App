import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Filter,
  Download,
  BarChart,
  PieChart,
  Users,
  Clock,
} from "lucide-react";

interface ServiceDemandHeatmapProps {
  hubId?: string;
}

const ServiceDemandHeatmap: React.FC<ServiceDemandHeatmapProps> = ({
  hubId,
}) => {
  const [timeRange, setTimeRange] = useState("month");
  const [serviceType, setServiceType] = useState("all");
  const [viewMode, setViewMode] = useState("heatmap");

  // This would be replaced with actual data from your backend
  const generateMockHeatmapData = () => {
    // Mock data for demonstration
    return Array.from({ length: 10 }, (_, i) => ({
      id: `area-${i + 1}`,
      name: `Area ${i + 1}`,
      zipCode: `1000${i}`,
      requestCount: Math.floor(Math.random() * 100),
      activeHelpers: Math.floor(Math.random() * 20),
      averageResponseTime: Math.floor(Math.random() * 60) + 10, // minutes
      topServices: [
        "Transportation",
        "Shopping",
        "Home Maintenance",
        "Companionship",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
    }));
  };

  const heatmapData = generateMockHeatmapData();

  // Sort areas by request count (highest first)
  const sortedAreas = [...heatmapData].sort(
    (a, b) => b.requestCount - a.requestCount,
  );

  // Calculate demand level based on request count
  const getDemandLevel = (count: number) => {
    if (count > 70) return "High";
    if (count > 30) return "Medium";
    return "Low";
  };

  // Get color class based on demand level
  const getDemandColorClass = (count: number) => {
    if (count > 70) return "bg-red-500";
    if (count > 30) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Get badge variant based on demand level
  const getDemandBadgeVariant = (count: number) => {
    if (count > 70) return "destructive";
    if (count > 30) return "warning";
    return "success";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Service Demand Analysis</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="medical">Medical Appointments</SelectItem>
              <SelectItem value="companionship">Companionship</SelectItem>
              <SelectItem value="maintenance">Home Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="heatmap" className="text-lg py-3">
            <MapPin className="mr-2 h-5 w-5" />
            Heatmap View
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-lg py-3">
            <BarChart className="mr-2 h-5 w-5" />
            Analytics View
          </TabsTrigger>
          <TabsTrigger value="allocation" className="text-lg py-3">
            <Users className="mr-2 h-5 w-5" />
            Resource Allocation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Demand Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg mb-6 relative overflow-hidden">
                {/* This would be replaced with an actual map component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">
                    Interactive map would be displayed here
                  </p>
                </div>
                {/* Mock heatmap overlay */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full opacity-30"></div>
                <div className="absolute top-40 left-40 w-32 h-32 bg-red-500 rounded-full opacity-40"></div>
                <div className="absolute top-20 left-80 w-24 h-24 bg-yellow-500 rounded-full opacity-30"></div>
                <div className="absolute top-60 left-20 w-16 h-16 bg-green-500 rounded-full opacity-30"></div>
                <div className="absolute top-30 left-60 w-28 h-28 bg-yellow-500 rounded-full opacity-30"></div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Demand by Area</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Low</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Medium</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">High</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {sortedAreas.slice(0, 5).map((area) => (
                  <div
                    key={area.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full ${getDemandColorClass(
                          area.requestCount,
                        )}`}
                      ></div>
                      <div>
                        <h4 className="font-medium">{area.name}</h4>
                        <p className="text-sm text-gray-500">
                          Zip Code: {area.zipCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Requests</p>
                        <p className="font-bold">{area.requestCount}</p>
                      </div>
                      <Badge variant={getDemandBadgeVariant(area.requestCount)}>
                        {getDemandLevel(area.requestCount)} Demand
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative">
                  {/* This would be replaced with an actual chart component */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PieChart className="h-48 w-48 text-gray-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">Most Requested</h4>
                    <p className="text-2xl font-bold mt-1">Transportation</p>
                    <p className="text-sm text-gray-500">32% of all requests</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">Fastest Growing</h4>
                    <p className="text-2xl font-bold mt-1">Home Maintenance</p>
                    <p className="text-sm text-gray-500">+45% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demand by Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative">
                  {/* This would be replaced with an actual chart component */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BarChart className="h-48 w-48 text-gray-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">Peak Day</h4>
                    <p className="text-2xl font-bold mt-1">Monday</p>
                    <p className="text-sm text-gray-500">
                      28% higher than average
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">Peak Time</h4>
                    <p className="text-2xl font-bold mt-1">9AM - 11AM</p>
                    <p className="text-sm text-gray-500">
                      35% of daily requests
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Helper Resource Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-500">Total Helpers</h3>
                    <p className="text-3xl font-bold mt-1">48</p>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <span>+5 from last month</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-500">
                      Current Utilization
                    </h3>
                    <p className="text-3xl font-bold mt-1">76%</p>
                    <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: "76%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-500">
                      Avg. Response Time
                    </h3>
                    <p className="text-3xl font-bold mt-1">24 min</p>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <span>-3 min from last month</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mt-6 mb-3">
                  Areas Needing More Resources
                </h3>
                <div className="space-y-3">
                  {sortedAreas
                    .filter((area) => area.requestCount > 70)
                    .map((area) => (
                      <div
                        key={area.id}
                        className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg"
                      >
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{area.name}</h4>
                            <Badge className="ml-2 bg-red-100 text-red-800">
                              High Demand
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{area.activeHelpers} active helpers</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {area.averageResponseTime} min response time
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm">
                              Top services: {area.topServices.join(", ")}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Button size="sm">Allocate Resources</Button>
                        </div>
                      </div>
                    ))}
                </div>

                <h3 className="font-semibold text-lg mt-6 mb-3">
                  Suggested Helper Allocation
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Area
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Current Helpers
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Recommended
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Gap
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {sortedAreas.slice(0, 5).map((area) => {
                        const recommended = Math.ceil(area.requestCount / 10);
                        const gap = recommended - area.activeHelpers;
                        return (
                          <tr key={area.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">
                              {area.name}
                            </td>
                            <td className="px-4 py-3">{area.activeHelpers}</td>
                            <td className="px-4 py-3">{recommended}</td>
                            <td className="px-4 py-3">
                              <span
                                className={
                                  gap > 0
                                    ? "text-red-600 font-medium"
                                    : "text-green-600 font-medium"
                                }
                              >
                                {gap > 0 ? `+${gap} needed` : "Sufficient"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              {gap > 0 && (
                                <Button size="sm" variant="outline">
                                  Recruit
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceDemandHeatmap;
