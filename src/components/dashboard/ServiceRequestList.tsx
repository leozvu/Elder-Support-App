import React, { useEffect, useState } from "react";
import { db } from "@/lib/local-database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tables } from "@/types/supabase";
import { CalendarClock, MapPin, Clock, Search, Package } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
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

const ServiceRequestList = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  // Filter requests based on search query and status filter
  useEffect(() => {
    if (!requests.length) return;

    let filtered = [...requests];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
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
  }, [requests, searchQuery, statusFilter]);

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const user = await db.getCurrentUser();

        if (!user) {
          setError("User not authenticated");
          return;
        }

        let query;
        if (user.role === "customer") {
          // Customer sees their own requests
          query = db
            .from("service_requests")
            .select(
              `*, 
              service_type:service_type_id(id, name, icon), 
              helper:helper_id(id, full_name, avatar_url)`,
            )
            .eq("customer_id", user.id)
            .order("scheduled_time", { ascending: false });
        } else if (user.role === "helper") {
          // Helper sees requests assigned to them
          query = db
            .from("service_requests")
            .select(
              `*, 
              service_type:service_type_id(id, name, icon), 
              customer:customer_id(id, full_name, avatar_url)`,
            )
            .eq("helper_id", user.id)
            .order("scheduled_time", { ascending: false });
        } else {
          // Admin sees all requests
          query = db
            .from("service_requests")
            .select(
              `*, 
              service_type:service_type_id(id, name, icon), 
              helper:helper_id(id, full_name, avatar_url), 
              customer:customer_id(id, full_name, avatar_url)`,
            )
            .order("scheduled_time", { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;
        const requestsData = data || [];
        setRequests(requestsData);
        setFilteredRequests(requestsData);
      } catch (err: any) {
        console.error("Error loading service requests:", err);
        setError(err.message || "Failed to load service requests");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading service requests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40 flex-col gap-4">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40 flex-col gap-4">
            <p className="text-gray-500">No service requests found</p>
            <Button onClick={() => navigate("/service-request")}>
              Request a Service
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Service Requests</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/service-history")}
            >
              View History
            </Button>
            <Button size="sm" onClick={() => navigate("/service-request")}>
              New Request
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/service-bundles")}
            >
              <Package className="h-4 w-4 mr-2" /> Bundles
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/service-tracking/${request.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {request.service_type?.name || "Unknown Service"}
                  </h3>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{request.address}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                    request.status,
                  )}`}
                >
                  {formatStatus(request.status)}
                </span>
              </div>

              <div className="mt-3 flex items-center text-gray-500">
                <CalendarClock className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {format(new Date(request.scheduled_time), "PPP")}
                </span>
                <Clock className="h-4 w-4 ml-3 mr-1" />
                <span className="text-sm">
                  {format(new Date(request.scheduled_time), "p")}
                </span>
              </div>

              {request.helper && (
                <div className="mt-3 flex items-center">
                  <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                    <img
                      src={
                        request.helper.avatar_url ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Helper"
                      }
                      alt="Helper"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm">
                    Helper: {request.helper.full_name}
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

export default ServiceRequestList;
