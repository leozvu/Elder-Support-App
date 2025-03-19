import React, { useEffect, useState } from "react";
import { db } from "@/lib/local-database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/types/supabase";
import { CalendarClock, MapPin, Clock, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ServiceRequest = Tables<"service_requests"> & {
  service_type: Tables<"service_types">;
  helper?: Tables<"users">;
};

const SimplifiedServiceHistory = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Filter requests based on search query and filters
  useEffect(() => {
    if (!requests.length) return;

    let filtered = [...requests];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));

      if (dateFilter === "30days") {
        filtered = filtered.filter(
          (request) => new Date(request.scheduled_time) >= thirtyDaysAgo,
        );
      } else if (dateFilter === "90days") {
        filtered = filtered.filter(
          (request) => new Date(request.scheduled_time) >= ninetyDaysAgo,
        );
      }
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.service_type?.name?.toLowerCase().includes(query) ||
          request.address?.toLowerCase().includes(query) ||
          request.helper?.full_name?.toLowerCase().includes(query),
      );
    }

    setFilteredRequests(filtered);
  }, [requests, searchQuery, statusFilter, dateFilter]);

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const user = await db.getCurrentUser();

        if (!user) {
          setError("User not authenticated");
          return;
        }

        // Only get completed or cancelled requests for history
        const { data, error } = await db
          .from("service_requests")
          .select(
            `*, 
            service_type:service_type_id(id, name, icon), 
            helper:helper_id(id, full_name, avatar_url)`,
          )
          .eq("customer_id", user.id)
          .in("status", ["completed", "cancelled"])
          .order("scheduled_time", { ascending: false });

        if (error) throw error;
        const requestsData = data || [];
        setRequests(requestsData);
        setFilteredRequests(requestsData);
      } catch (err: any) {
        console.error("Error loading service history:", err);
        setError(err.message || "Failed to load service history");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="secondary"
            className="text-lg py-1 px-3 bg-green-100 text-green-800 border-green-300"
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="secondary"
            className="text-lg py-1 px-3 bg-red-100 text-red-800 border-red-300"
          >
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="text-lg py-1 px-3 bg-gray-100 text-gray-800 border-gray-300"
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card className="w-full bg-white shadow-md">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-xl text-gray-500">Loading service history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-white shadow-md">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40 flex-col gap-4">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="w-full bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Service History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-xl text-gray-500">No past services found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Service History</CardTitle>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search service history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="border-2 rounded-lg p-5 hover:border-primary transition-colors cursor-pointer bg-gray-50"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-xl md:text-2xl mb-2">
                    {request.service_type?.name || "Unknown Service"}
                  </h3>
                  <div className="flex items-center text-gray-700 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{request.address}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-700 mb-2">
                    <div className="flex items-center">
                      <CalendarClock className="h-5 w-5 mr-2" />
                      <span className="text-lg">
                        {format(new Date(request.scheduled_time), "PPP")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      <span className="text-lg">
                        {format(new Date(request.scheduled_time), "p")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {getStatusBadge(request.status)}
                </div>
              </div>

              {request.helper && (
                <div className="mt-4 flex items-center border-t pt-4 border-gray-200">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-gray-300">
                    <img
                      src={
                        request.helper.avatar_url ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Helper"
                      }
                      alt="Helper"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-lg">
                    Helped by: <strong>{request.helper.full_name}</strong>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplifiedServiceHistory;
