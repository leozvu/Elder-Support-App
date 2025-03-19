import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  Flag,
  MessageSquare,
  Users,
} from "lucide-react";
import ReportingSystem from "./ReportingSystem";
import EmergencyProtocol from "../emergency/EmergencyProtocol";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface SafetyDashboardProps {
  userType: "elderly" | "helper" | "caregiver";
  userId: string;
  userName: string;
}

const SafetyDashboard = ({
  userType,
  userId,
  userName,
}: SafetyDashboardProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  // Mock emergency contacts
  const emergencyContacts = [
    {
      id: "ec1",
      name: "John Smith",
      phone: "(555) 123-4567",
      relationship: "Son",
    },
    {
      id: "ec2",
      name: "Mary Johnson",
      phone: "(555) 987-6543",
      relationship: "Daughter",
    },
    {
      id: "ec3",
      name: "Dr. Williams",
      phone: "(555) 456-7890",
      relationship: "Primary Physician",
    },
  ];

  const handleReportSubmit = (reportData: any) => {
    console.log("Report submitted:", reportData);
    toast({
      title: t("safety.reportReceived"),
      description: t("safety.reportProcessing"),
    });
    setShowReportDialog(false);
  };

  const handleEmergencyAction = () => {
    setShowEmergencyDialog(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("safety.safetyAndTrust")}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowReportDialog(true)}
          >
            <Flag className="h-4 w-4" />
            {t("safety.reportIssue")}
          </Button>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleEmergencyAction}
          >
            <AlertTriangle className="h-4 w-4" />
            {t("safety.emergency")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-lg py-3">
            <Shield className="h-4 w-4 mr-2" />
            {t("safety.overview")}
          </TabsTrigger>
          <TabsTrigger value="verification" className="text-lg py-3">
            <Users className="h-4 w-4 mr-2" />
            {t("safety.verification")}
          </TabsTrigger>
          <TabsTrigger value="resources" className="text-lg py-3">
            <MessageSquare className="h-4 w-4 mr-2" />
            {t("safety.resources")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t("safety.safetyFeatures")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t("safety.sosButton")}</h3>
                      <p className="text-sm text-gray-500">
                        {t("safety.sosButtonDesc")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t("safety.emergencyChat")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t("safety.emergencyChatDesc")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t("safety.emergencyContacts")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t("safety.emergencyContactsDesc")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Flag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t("safety.reportingSystem")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t("safety.reportingSystemDesc")}
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t("safety.trustFeatures")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t("safety.verificationBadges")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t("safety.verificationBadgesDesc")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t("safety.twoWayRatings")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t("safety.twoWayRatingsDesc")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t("safety.checkInSystem")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t("safety.checkInSystemDesc")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t("safety.safeWordSystem")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t("safety.safeWordSystemDesc")}
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("safety.verificationExplained")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {t("safety.helperVerification")}
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 border-green-200 text-green-700 flex items-center gap-1"
                        >
                          <Shield className="h-3 w-3" />
                          {t("helper.badges.backgroundCheck")}
                        </Badge>
                        <span className="text-sm">
                          {t("safety.backgroundCheckExplained")}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 border-blue-200 text-blue-700 flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          {t("helper.badges.identityVerified")}
                        </Badge>
                        <span className="text-sm">
                          {t("safety.identityVerifiedExplained")}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 border-purple-200 text-purple-700 flex items-center gap-1"
                        >
                          <Award className="h-3 w-3" />
                          {t("helper.badges.skillsCertified")}
                        </Badge>
                        <span className="text-sm">
                          {t("safety.skillsCertifiedExplained")}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge
                          variant="outline"
                          className="bg-amber-50 border-amber-200 text-amber-700 flex items-center gap-1"
                        >
                          <Award className="h-3 w-3" />
                          {t("helper.badges.trainingCompleted")}
                        </Badge>
                        <span className="text-sm">
                          {t("safety.trainingCompletedExplained")}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {t("safety.hubVerification")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("safety.hubVerificationExplained")}
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {t("safety.verificationProcess")}
                      </h4>
                      <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li>{t("safety.verificationStep1")}</li>
                        <li>{t("safety.verificationStep2")}</li>
                        <li>{t("safety.verificationStep3")}</li>
                        <li>{t("safety.verificationStep4")}</li>
                        <li>{t("safety.verificationStep5")}</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">
                    {t("safety.verifyYourself")}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t("safety.verifyYourselfExplained")}
                  </p>
                  <Button className="gap-2">
                    <Shield className="h-4 w-4" />
                    {t("safety.startVerification")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("safety.safetyResources")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {t("safety.emergencyContacts")}
                    </h3>
                    <div className="space-y-3">
                      {emergencyContacts.map((contact) => (
                        <div key={contact.id} className="p-3 border rounded-lg">
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-500">
                            {contact.relationship} • {contact.phone}
                          </p>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        {t("safety.manageEmergencyContacts")}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {t("safety.helpfulResources")}
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-700">
                          {t("safety.nationalHelpline")}
                        </h4>
                        <p className="text-sm">1-800-677-1116</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t("safety.nationalHelplineDesc")}
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-700">
                          {t("safety.elderAbusePrevention")}
                        </h4>
                        <p className="text-sm">1-800-222-8000</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t("safety.elderAbusePreventionDesc")}
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-700">
                          {t("safety.localSeniorCenter")}
                        </h4>
                        <p className="text-sm">(555) 123-4567</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t("safety.localSeniorCenterDesc")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">
                    {t("safety.safetyTips")}
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t("safety.safetyTip1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t("safety.safetyTip2")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t("safety.safetyTip3")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t("safety.safetyTip4")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t("safety.safetyTip5")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-4xl p-0">
          <ReportingSystem
            userType={userType}
            onSubmit={handleReportSubmit}
            onCancel={() => setShowReportDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="max-w-4xl p-0">
          <EmergencyProtocol
            userId={userId}
            userName={userName}
            emergencyContacts={emergencyContacts}
            onCancel={() => setShowEmergencyDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Star = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Award = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variant === "outline" ? "border" : "bg-primary/10 text-primary"} ${className}`}
  >
    {children}
  </span>
);

export default SafetyDashboard;
