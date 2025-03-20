import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Phone, 
  Navigation,
  AlertTriangle
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/local-database";
import { useAuth } from "@/lib/auth";

const ServiceTracking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userDetails } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [service, setService] = useState<any>(null);
  
  // Mock service data
  const mockService = {
    id: id,
    type: "Grocery Shopping",
    status: "in_progress",
    scheduledTime: "2023-06-15T10:00:00",
    address: "123 Elder Street, Careville",
    notes: "Please get items from the shopping list. I prefer organic produce if available.",
    customer: {
      id: "cust1",
      name: "Martha Johnson",
      phone: "(555) 123-4567",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha"
    },
    helper: {
      id: "help1",
      name: "John Smith",
      phone: "(555) 987-6543",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    timeline: [
      { time: "2023-06-14T15:30:00", event: "Service requested" },
      { time: "2023-06-14T16:45:00", event: "Helper assigned" },
      { time: "2023-06-15T09:45:00", event: "Helper on the way" },
      { time: "2023-06-15T10:05:00", event: "Service started" }
    ]
  };
  
  useEffect(() => {
    async function loadServiceData() {
      try {
        setIsLoading(true);
        
        // In a real app, we would fetch the service data from the database
        // For now, we'll use mock data
        setTimeout(() => {
          setService(mockService);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error loading service data:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        setIsLoading(false);
      }
    }
    
    loadServiceData();
  }, [id]);
  
  const handleCompleteService = () => {
    toast({
      title: "Service Completed",
      description: "The service has been marked as completed.",
      variant: "default",
    });
    
    setService({
      ...service,
      status: "completed",
      timeline: [
        ...service.timeline,
        { time: new Date().toISOString(), event: "Service completed" }
      ]
    });
  };
  
  const handleCancelService = () => {
    toast({
      title: "Service Cancelled",
      description: "The service has been cancelled.",
      variant: "destructive",
    });
    
    setService({
      ...service,
      status: "cancelled",
      timeline: [
        ...service.timeline,
        { time: new Date().toISOString(), event: "Service cancelled" }
      ]
    });
  };
  
  const handleContactUser = (userType: 'customer' | 'helper') => {
    const user = userType === 'customer' ? service.customer : service.helper;
    toast({
      title: `Contacting ${user.name}`,
      description: `Calling ${user.phone}`,
    });
    // In a real app, this would initiate a call or open a chat
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading service details...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">An error occurred while loading the service details:</p>
              <div className="bg-red-50 p-3 rounded-md mb-4">
                <p className="text-red-700">{error.message}</p>
              </div>
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  if (!service) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-yellow-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Service Not Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The requested service could not be found.</p>
              <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  const isCustomer = userDetails?.role === "customer";
  const isHelper = userDetails?.role === "helper";
  const isAdmin = userDetails?.role === "admin";
  
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Service Tracking</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{service.type}</span>
                  {getStatusBadge(service.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>{formatDate(service.scheduledTime)}</span>
                    <Clock className="h-5 w-5 text-gray-500 ml-4" />
                    <span>{formatTime(service.scheduledTime)}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <span>{service.address}</span>
                  </div>
                  
                  {service.notes && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Notes</h3>
                      <p>{service.notes}</p>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-3">Service Timeline</h3>
                    <div className="space-y-3">
                      {service.timeline.map((item: any, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="bg-primary/10 p-1 rounded-full">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{item.event}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(item.time)} at {formatTime(item.time)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {service.status === "in_progress" && (
                    <div className="border-t pt-4 mt-4 flex justify-end gap-3">
                      <Button 
                        variant="outline" 
                        onClick={handleCancelService}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Service
                      </Button>
                      <Button 
                        onClick={handleCompleteService}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Service
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isHelper ? "Customer" : "Helper"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img 
                        src={isHelper ? service.customer.avatar : service.helper.avatar} 
                        alt={isHelper ? service.customer.name : service.helper.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {isHelper ? service.customer.name : service.helper.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isHelper ? service.customer.phone : service.helper.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleContactUser(isHelper ? 'customer' : 'helper')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(isHelper ? `/chat/${service.customer.id}` : `/chat/${service.helper.id}`)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-gray-100 rounded-md flex items-center justify-center mb-4">
                    <p className="text-gray-500">Map View</p>
                  </div>
                  <Button className="w-full">
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
              
              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Admin Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/admin/reassign/${service.id}`)}
                      >
                        Reassign Helper
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/admin/edit-service/${service.id}`)}
                      >
                        Edit Service Details
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={handleCancelService}
                      >
                        Cancel Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceTracking;