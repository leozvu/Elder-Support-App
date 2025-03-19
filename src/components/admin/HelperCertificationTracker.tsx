import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  GraduationCap,
  Upload,
  Clock,
  BarChart,
} from "lucide-react";

interface HelperCertificationTrackerProps {
  hubId?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  verified: boolean;
  documentUrl?: string;
  status: "active" | "expiring" | "expired";
}

interface Helper {
  id: string;
  name: string;
  avatar: string;
  role: string;
  certifications: Certification[];
  trainingHours: number;
  lastTraining?: string;
}

const HelperCertificationTracker: React.FC<HelperCertificationTrackerProps> = ({
  hubId,
}) => {
  const [activeTab, setActiveTab] = useState("certifications");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);

  // Mock data for demonstration
  const helpers: Helper[] = [
    {
      id: "helper-1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      role: "Elder Care Specialist",
      certifications: [
        {
          id: "cert-1",
          name: "CPR & First Aid",
          issuer: "American Red Cross",
          date: "2022-05-15",
          expiryDate: "2024-05-15",
          verified: true,
          documentUrl: "#",
          status: "active",
        },
        {
          id: "cert-2",
          name: "Certified Nursing Assistant (CNA)",
          issuer: "State Board of Nursing",
          date: "2019-03-10",
          expiryDate: "2025-03-10",
          verified: true,
          documentUrl: "#",
          status: "active",
        },
      ],
      trainingHours: 45,
      lastTraining: "2023-11-10",
    },
    {
      id: "helper-2",
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      role: "Home Care Aide",
      certifications: [
        {
          id: "cert-3",
          name: "First Aid Certification",
          issuer: "American Red Cross",
          date: "2021-08-20",
          expiryDate: "2023-08-20",
          verified: true,
          documentUrl: "#",
          status: "expired",
        },
      ],
      trainingHours: 32,
      lastTraining: "2023-09-05",
    },
    {
      id: "helper-3",
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      role: "Companion Care Provider",
      certifications: [
        {
          id: "cert-4",
          name: "Elder Care Specialist",
          issuer: "Senior Care Institute",
          date: "2022-01-15",
          expiryDate: "2024-01-15",
          verified: true,
          documentUrl: "#",
          status: "expiring",
        },
        {
          id: "cert-5",
          name: "Dementia Care Training",
          issuer: "Alzheimer's Association",
          date: "2022-03-10",
          verified: true,
          documentUrl: "#",
          status: "active",
        },
      ],
      trainingHours: 28,
      lastTraining: "2023-10-15",
    },
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status: Certification["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "expiring":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>
        );
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredHelpers = helpers.filter((helper) =>
    helper.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddCertification = () => {
    // In a real app, this would save the new certification
    setShowAddCertification(false);
  };

  const handleViewHelper = (helper: Helper) => {
    setSelectedHelper(helper);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Helper Training & Certification Tracker
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search helpers..."
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Helpers</p>
                <p className="text-3xl font-bold">{helpers.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expiring Certifications</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Training Hours (Avg)</p>
                <p className="text-3xl font-bold">35</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="certifications"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="certifications" className="text-lg py-3">
            <Award className="mr-2 h-5 w-5" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="training" className="text-lg py-3">
            <GraduationCap className="mr-2 h-5 w-5" />
            Training Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHelpers.map((helper) => (
              <Card key={helper.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={helper.avatar} alt={helper.name} />
                        <AvatarFallback>{helper.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{helper.name}</h3>
                        <p className="text-sm text-gray-600">{helper.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Certifications</h4>
                        <Badge variant="outline">
                          {helper.certifications.length} Total
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {helper.certifications.slice(0, 2).map((cert) => (
                          <div
                            key={cert.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                          >
                            <div>
                              <p className="font-medium text-sm">{cert.name}</p>
                              <p className="text-xs text-gray-500">
                                {cert.expiryDate
                                  ? `Expires: ${formatDate(cert.expiryDate)}`
                                  : "No Expiration"}
                              </p>
                            </div>
                            {getStatusBadge(cert.status)}
                          </div>
                        ))}

                        {helper.certifications.length > 2 && (
                          <p className="text-xs text-center text-gray-500 mt-1">
                            +{helper.certifications.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Training Hours</h4>
                      <span className="text-sm font-medium">
                        {helper.trainingHours} hours
                      </span>
                    </div>
                    <Progress
                      value={(helper.trainingHours / 50) * 100}
                      className="h-2 mb-2"
                    />
                    <p className="text-xs text-gray-500">
                      Last training: {formatDate(helper.lastTraining || "")}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewHelper(helper)}
                      >
                        <FileText className="mr-2 h-4 w-4" /> View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedHelper(helper);
                          setShowAddCertification(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Certification
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Completion by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">CPR & First Aid</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Medication Management</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Dementia Care</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Mobility Assistance</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Emergency Response</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Certification Renewals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      helper: "Emily Rodriguez",
                      certification: "Elder Care Specialist",
                      expiry: "2024-01-15",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
                    },
                    {
                      helper: "David Wilson",
                      certification: "CPR Certification",
                      expiry: "2024-02-10",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
                    },
                    {
                      helper: "Jessica Martinez",
                      certification: "Home Health Aide",
                      expiry: "2024-03-05",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.avatar} alt={item.helper} />
                          <AvatarFallback>
                            {item.helper.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{item.helper}</p>
                          <p className="text-sm text-gray-600">
                            {item.certification}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Expires {formatDate(item.expiry)}
                        </Badge>
                        <Button variant="ghost" size="sm" className="mt-1">
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-4">
                  <Calendar className="mr-2 h-4 w-4" /> Schedule Training
                  Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Certification Dialog */}
      <Dialog
        open={showAddCertification}
        onOpenChange={setShowAddCertification}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Add Certification for {selectedHelper?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Certification</label>
              <Input
                id="certification"
                placeholder="e.g. CPR & First Aid"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Issuing Organization</label>
              <Input
                id="issuer"
                placeholder="e.g. American Red Cross"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Issue Date</label>
              <Input id="issueDate" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Expiry Date</label>
              <Input id="expiryDate" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Document</label>
              <div className="col-span-3">
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" /> Upload Certificate
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddCertification(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCertification}>Save Certification</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Helper Details Dialog */}
      <Dialog
        open={!!selectedHelper && !showAddCertification}
        onOpenChange={() => setSelectedHelper(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Helper Profile & Certifications</DialogTitle>
          </DialogHeader>
          {selectedHelper && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedHelper.avatar}
                    alt={selectedHelper.name}
                  />
                  <AvatarFallback>
                    {selectedHelper.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedHelper.name}</h2>
                  <p className="text-gray-600">{selectedHelper.role}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Certifications & Credentials
                  </h3>
                  <div className="space-y-3">
                    {selectedHelper.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="border rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{cert.name}</h4>
                            <p className="text-sm text-gray-600">
                              {cert.issuer}
                            </p>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Issued: {formatDate(cert.date)}</span>
                              {cert.expiryDate && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>
                                    Expires: {formatDate(cert.expiryDate)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {getStatusBadge(cert.status)}
                          </div>
                        </div>
                        {cert.documentUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() =>
                              window.open(cert.documentUrl, "_blank")
                            }
                          >
                            <FileText className="h-4 w-4 mr-1" /> View
                            Certificate
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Training & Development
                  </h3>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Total Training Hours</span>
                      <span className="font-bold">
                        {selectedHelper.trainingHours} hours
                      </span>
                    </div>
                    <Progress
                      value={(selectedHelper.trainingHours / 50) * 100}
                      className="h-2 mb-2"
                    />
                    <p className="text-sm text-gray-600">
                      Last training completed on{" "}
                      {formatDate(selectedHelper.lastTraining || "")}
                    </p>

                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium">Recent Training Sessions</h4>
                      <div className="text-sm space-y-1">
                        <p>• Dementia Care Workshop - 8 hours</p>
                        <p>• Medication Management Refresher - 4 hours</p>
                        <p>• Emergency Response Training - 6 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedHelper(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowAddCertification(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Certification
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelperCertificationTracker;
