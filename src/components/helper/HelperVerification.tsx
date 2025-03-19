import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  FileText,
  Shield,
  User,
  Briefcase,
  Award,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

type VerificationStatus = "pending" | "in_progress" | "approved" | "rejected";

interface Document {
  id: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  uploadDate: string;
  fileUrl?: string;
  comments?: string;
}

interface VerificationStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  isRequired: boolean;
  details?: string;
  actionUrl?: string;
}

interface HelperVerificationProps {
  status?: VerificationStatus;
  documents?: Document[];
  steps?: VerificationStep[];
  onUploadDocument?: (
    document: Omit<Document, "id" | "status" | "uploadDate">,
  ) => void;
  onDeleteDocument?: (documentId: string) => void;
}

const HelperVerification = ({
  status = "in_progress",
  documents: initialDocuments = [
    {
      id: "1",
      name: "ID Card",
      type: "identification",
      status: "approved" as const,
      uploadDate: "2023-05-10",
      fileUrl: "#",
    },
    {
      id: "2",
      name: "Background Check Consent",
      type: "consent",
      status: "approved" as const,
      uploadDate: "2023-05-10",
      fileUrl: "#",
    },
    {
      id: "3",
      name: "Professional Certification",
      type: "certification",
      status: "pending" as const,
      uploadDate: "2023-05-12",
      fileUrl: "#",
    },
    {
      id: "4",
      name: "Reference Letter",
      type: "reference",
      status: "pending" as const,
      uploadDate: "2023-05-12",
      fileUrl: "#",
    },
  ],
  steps: initialSteps = [
    {
      id: "1",
      name: "Account Creation",
      description: "Create your helper account",
      status: "completed" as const,
      isRequired: true,
    },
    {
      id: "2",
      name: "Document Submission",
      description: "Upload required identification and certifications",
      status: "in_progress" as const,
      isRequired: true,
    },
    {
      id: "3",
      name: "Background Check",
      description: "Criminal record and reference verification",
      status: "pending" as const,
      isRequired: true,
      details:
        "Our platform uses a secure third-party service to verify your identity and conduct a comprehensive background check. This includes criminal history, reference verification, and credential validation.",
      actionUrl: "#initiate-background-check",
    },
    {
      id: "4",
      name: "Skills Assessment",
      description: "Complete online training modules",
      status: "pending" as const,
      isRequired: true,
    },
    {
      id: "5",
      name: "Interview",
      description: "Virtual interview with a hub coordinator",
      status: "pending" as const,
      isRequired: true,
    },
    {
      id: "6",
      name: "Final Approval",
      description: "Review and approval by community hub",
      status: "pending" as const,
      isRequired: true,
    },
  ],
  onUploadDocument,
  onDeleteDocument,
}: HelperVerificationProps) => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [verificationSteps, setVerificationSteps] =
    useState<VerificationStep[]>(initialSteps);
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "identification",
    fileUrl: "",
  });
  const { toast } = useToast();

  // Calculate verification progress
  const completedSteps = verificationSteps.filter(
    (step) => step.status === "completed",
  ).length;
  const totalSteps = verificationSteps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  // Handle document upload
  const handleUploadDocument = () => {
    if (!newDocument.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a document name",
        variant: "destructive",
      });
      return;
    }

    const document = {
      ...newDocument,
    };

    if (onUploadDocument) {
      onUploadDocument(document);
    } else {
      // Local state handling if no callback provided
      const newDoc: Document = {
        id: `${documents.length + 1}`,
        status: "pending",
        uploadDate: new Date().toISOString().split("T")[0],
        ...document,
      };

      setDocuments([...documents, newDoc]);

      // Update document submission step if it's in progress
      const updatedSteps = verificationSteps.map((step) => {
        if (step.id === "2" && step.status === "pending") {
          return { ...step, status: "in_progress" };
        }
        return step;
      });
      setVerificationSteps(updatedSteps);
    }

    // Reset form and close dialog
    setNewDocument({ name: "", type: "identification", fileUrl: "" });
    setUploadDialogOpen(false);

    toast({
      title: "Document Uploaded",
      description: "Your document has been submitted for review",
    });
  };

  // Handle document deletion
  const handleDeleteDocument = (documentId: string) => {
    if (onDeleteDocument) {
      onDeleteDocument(documentId);
    } else {
      setDocuments(documents.filter((doc) => doc.id !== documentId));
    }

    toast({
      title: "Document Removed",
      description: "The document has been removed from your application",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "rejected":
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("helper.verification.title")}</h1>
        <Badge
          className={`text-lg px-4 py-2 ${getStatusColor(status)}`}
          variant="outline"
        >
          {status === "in_progress"
            ? t("helper.verification.status.inProgress")
            : status === "approved"
              ? t("helper.verification.status.approved")
              : status === "rejected"
                ? t("helper.verification.status.rejected")
                : t("helper.verification.status.pending")}
        </Badge>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold">
                {t("helper.verification.progress.title")}
              </h2>
              <p className="text-gray-500">
                {t("helper.verification.progress.description")}
              </p>
            </div>
            <div className="text-2xl font-bold">{progress}%</div>
          </div>
          <Progress value={progress} className="h-3 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
              <Shield className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium text-center">
                {t("helper.verification.progress.backgroundCheck")}
              </h3>
              <p className="text-sm text-center text-gray-500">
                {verificationSteps.find((step) => step.id === "3")?.status ===
                "completed"
                  ? t("helper.verification.progress.completed")
                  : t("helper.verification.progress.pending")}
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
              <User className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium text-center">
                {t("helper.verification.progress.identityVerification")}
              </h3>
              <p className="text-sm text-center text-gray-500">
                {documents.some(
                  (doc) =>
                    doc.type === "identification" && doc.status === "approved",
                )
                  ? t("helper.verification.progress.completed")
                  : t("helper.verification.progress.pending")}
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
              <Award className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium text-center">
                {t("helper.verification.progress.skillsVerification")}
              </h3>
              <p className="text-sm text-center text-gray-500">
                {verificationSteps.find((step) => step.id === "4")?.status ===
                "completed"
                  ? t("helper.verification.progress.completed")
                  : t("helper.verification.progress.pending")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-lg py-3">
            {t("helper.verification.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-lg py-3">
            {t("helper.verification.tabs.documents")}
            <Badge className="ml-2 bg-primary/10 text-primary">
              {documents.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="steps" className="text-lg py-3">
            {t("helper.verification.tabs.steps")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("helper.verification.overview.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("helper.verification.overview.welcome")}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t("helper.verification.overview.description")}
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">
                          {t("helper.verification.overview.status")}:{" "}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </h4>
                        <p className="text-blue-700 text-sm">
                          {status === "approved"
                            ? t(
                                "helper.verification.overview.statusMessages.approved",
                              )
                            : status === "rejected"
                              ? t(
                                  "helper.verification.overview.statusMessages.rejected",
                                )
                              : status === "in_progress"
                                ? t(
                                    "helper.verification.overview.statusMessages.inProgress",
                                  )
                                : t(
                                    "helper.verification.overview.statusMessages.pending",
                                  )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-primary/5">
                      <CardContent className="pt-6">
                        <h4 className="font-medium flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          {t("helper.verification.overview.documentSubmission")}
                        </h4>
                        <p className="text-sm text-gray-600 mt-2">
                          {t(
                            "helper.verification.overview.documentDescription",
                          )}
                        </p>
                        <Button
                          className="mt-4 w-full"
                          onClick={() => setActiveTab("documents")}
                        >
                          {t("helper.verification.overview.manageDocuments")}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-primary/5">
                      <CardContent className="pt-6">
                        <h4 className="font-medium flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                          {t("helper.verification.overview.verificationSteps")}
                        </h4>
                        <p className="text-sm text-gray-600 mt-2">
                          {t("helper.verification.overview.stepsDescription")}
                        </p>
                        <Button
                          className="mt-4 w-full"
                          onClick={() => setActiveTab("steps")}
                        >
                          {t("helper.verification.overview.viewSteps")}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("helper.verification.overview.nextSteps")}
                  </h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">
                          {t("helper.verification.overview.actionRequired")}
                        </h4>
                        <p className="text-yellow-700 text-sm">
                          {verificationSteps.find(
                            (step) =>
                              step.status === "pending" ||
                              step.status === "in_progress",
                          )?.description ||
                            "All steps completed. Waiting for final approval."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              {t("helper.verification.documents.title")}
            </h2>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />{" "}
                  {t("helper.verification.documents.upload")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {t("helper.verification.documents.uploadNew")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("helper.verification.documents.uploadDescription")}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="documentName">
                      {t("helper.verification.documents.documentName")}
                    </Label>
                    <Input
                      id="documentName"
                      placeholder="e.g., Driver's License"
                      value={newDocument.name}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="documentType">
                      {t("helper.verification.documents.documentType")}
                    </Label>
                    <select
                      id="documentType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newDocument.type}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="identification">
                        {t(
                          "helper.verification.documents.types.identification",
                        )}
                      </option>
                      <option value="certification">
                        {t("helper.verification.documents.types.certification")}
                      </option>
                      <option value="reference">
                        {t("helper.verification.documents.types.reference")}
                      </option>
                      <option value="consent">
                        {t("helper.verification.documents.types.consent")}
                      </option>
                      <option value="other">
                        {t("helper.verification.documents.types.other")}
                      </option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="documentFile">
                      {t("helper.verification.documents.uploadFile")}
                    </Label>
                    <Input
                      id="documentFile"
                      type="file"
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          fileUrl: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setUploadDialogOpen(false)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button onClick={handleUploadDocument}>
                    {t("common.submit")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {documents.length > 0 ? (
              documents.map((document) => (
                <Card key={document.id} className="overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <h3 className="font-medium">{document.name}</h3>
                        <p className="text-sm text-gray-500">
                          {t("helper.verification.documents.uploadedOn")}{" "}
                          {document.uploadDate}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={getStatusColor(document.status)}
                      variant="outline"
                    >
                      {document.status.charAt(0).toUpperCase() +
                        document.status.slice(1)}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">
                            {t("helper.verification.documents.type")}:
                          </span>{" "}
                          {document.type.charAt(0).toUpperCase() +
                            document.type.slice(1)}
                        </p>
                        {document.comments && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">
                              {t("helper.verification.documents.comments")}:
                            </span>{" "}
                            {document.comments}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {document.fileUrl && (
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />{" "}
                            {t("helper.verification.documents.view")}
                          </Button>
                        )}
                        {document.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDocument(document.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />{" "}
                            {t("helper.verification.documents.remove")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-xl text-gray-500">
                  {t("helper.verification.documents.noDocuments")}
                </p>
                <p className="text-gray-500 mt-2">
                  {t("helper.verification.documents.noDocumentsDescription")}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />{" "}
                  {t("helper.verification.documents.upload")}
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="steps" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">
            {t("helper.verification.steps.title")}
          </h2>

          <div className="space-y-4">
            {verificationSteps.map((step, index) => (
              <Card key={step.id} className="overflow-hidden">
                <div
                  className={`flex items-center p-4 ${
                    index ===
                    verificationSteps.findIndex(
                      (s) => s.status === "in_progress",
                    )
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0 mr-4">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${step.status === "completed" ? "bg-green-100" : step.status === "in_progress" ? "bg-blue-100" : step.status === "failed" ? "bg-red-100" : "bg-gray-100"}`}
                    >
                      {getStatusIcon(step.status)}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">
                        {t("helper.verification.steps.step")} {index + 1}:{" "}
                        {step.name}
                      </h3>
                      <Badge
                        className={getStatusColor(step.status)}
                        variant="outline"
                      >
                        {step.status === "in_progress"
                          ? t("helper.verification.steps.status.inProgress")
                          : step.status === "completed"
                            ? t("helper.verification.steps.status.completed")
                            : step.status === "pending"
                              ? t("helper.verification.steps.status.pending")
                              : t("helper.verification.steps.status.failed")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                {step.status === "in_progress" && (
                  <CardContent className="p-4 bg-blue-50 border-t border-blue-100">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">
                          {t("helper.verification.steps.actionRequired")}
                        </h4>
                        <p className="text-blue-700 text-sm">
                          {step.id === "2"
                            ? t(
                                "helper.verification.steps.actions.uploadDocuments",
                              )
                            : step.id === "3"
                              ? t(
                                  "helper.verification.steps.actions.backgroundCheck",
                                )
                              : step.id === "4"
                                ? t(
                                    "helper.verification.steps.actions.skillsAssessment",
                                  )
                                : step.id === "5"
                                  ? t(
                                      "helper.verification.steps.actions.interview",
                                    )
                                  : t(
                                      "helper.verification.steps.actions.processing",
                                    )}
                        </p>
                        {step.id === "2" && (
                          <Button
                            className="mt-2"
                            size="sm"
                            onClick={() => setActiveTab("documents")}
                          >
                            {t("helper.verification.steps.manageDocuments")}
                          </Button>
                        )}
                        {step.id === "3" && (
                          <Button
                            className="mt-2"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Background Check Initiated",
                                description:
                                  "You will receive an email with instructions to complete your background check.",
                              });
                              // Update step status
                              const updatedSteps = verificationSteps.map((s) =>
                                s.id === "3"
                                  ? { ...s, status: "in_progress" }
                                  : s,
                              );
                              setVerificationSteps(updatedSteps);
                            }}
                          >
                            Initiate Background Check
                          </Button>
                        )}
                        {step.id === "4" && (
                          <Button className="mt-2" size="sm">
                            {t("helper.verification.steps.startAssessment")}
                          </Button>
                        )}
                        {step.id === "5" && (
                          <Button className="mt-2" size="sm">
                            {t("helper.verification.steps.scheduleInterview")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}

                {step.status === "failed" && (
                  <CardContent className="p-4 bg-red-50 border-t border-red-100">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">
                          {t("helper.verification.steps.actionRequired")}
                        </h4>
                        <p className="text-red-700 text-sm">
                          This step has failed verification. Please review the
                          feedback and take the necessary actions to resolve the
                          issues.
                        </p>
                        <Button
                          className="mt-2"
                          size="sm"
                          variant="destructive"
                        >
                          {t("helper.verification.steps.viewDetails")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {status === "rejected" && (
            <Card className="mt-6 bg-red-50 border-red-100">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-red-800">
                      {t("helper.verification.steps.rejectionTitle")}
                    </h3>
                    <p className="text-red-700 mt-2">
                      {t("helper.verification.steps.rejectionDescription")}
                    </p>
                    <div className="mt-4 p-3 bg-white rounded-md border border-red-200">
                      <p className="text-gray-800 font-medium">
                        {t("helper.verification.steps.feedback")}:
                      </p>
                      <p className="text-gray-600 mt-1">
                        {t("helper.verification.steps.rejectionFeedback")}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button variant="destructive">
                        {t("helper.verification.steps.contactSupport")}
                      </Button>
                      <Button variant="outline">
                        {t("helper.verification.steps.reapply")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "approved" && (
            <Card className="mt-6 bg-green-50 border-green-100">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-green-800">
                      {t("helper.verification.steps.approvalTitle")}
                    </h3>
                    <p className="text-green-700 mt-2">
                      {t("helper.verification.steps.approvalDescription")}
                    </p>
                    <div className="mt-4 flex gap-3">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Briefcase className="mr-2 h-4 w-4" />{" "}
                        {t("helper.verification.steps.viewRequests")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelperVerification;
