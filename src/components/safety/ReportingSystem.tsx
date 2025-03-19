import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Flag, Shield, Clock } from "lucide-react";

interface ReportingSystemProps {
  userType: "elderly" | "helper" | "caregiver";
  serviceId?: string;
  recipientId?: string;
  recipientName?: string;
  onSubmit?: (reportData: ReportData) => void;
  onCancel?: () => void;
}

export interface ReportData {
  reportType: string;
  description: string;
  urgency: "low" | "medium" | "high";
  contactRequested: boolean;
  contactMethod?: string;
  contactDetails?: string;
  attachments?: File[];
}

const ReportingSystem = ({
  userType,
  serviceId,
  recipientId,
  recipientName,
  onSubmit,
  onCancel,
}: ReportingSystemProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [reportType, setReportType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium");
  const [contactRequested, setContactRequested] = useState<boolean>(false);
  const [contactMethod, setContactMethod] = useState<string>("phone");
  const [contactDetails, setContactDetails] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const reportTypes = {
    elderly: [
      "safety.reportTypes.inappropriateBehavior",
      "safety.reportTypes.serviceNotCompleted",
      "safety.reportTypes.lateArrival",
      "safety.reportTypes.unprofessionalConduct",
      "safety.reportTypes.other",
    ],
    helper: [
      "safety.reportTypes.unsafeEnvironment",
      "safety.reportTypes.inappropriateBehavior",
      "safety.reportTypes.accessIssues",
      "safety.reportTypes.other",
    ],
    caregiver: [
      "safety.reportTypes.inappropriateBehavior",
      "safety.reportTypes.serviceQualityConcern",
      "safety.reportTypes.safetyRisk",
      "safety.reportTypes.other",
    ],
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments([...attachments, ...fileArray]);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleSubmit = () => {
    if (!reportType) {
      toast({
        title: t("safety.reportTypeRequired"),
        description: t("safety.pleaseSelectReportType"),
        variant: "destructive",
      });
      return;
    }

    if (!description) {
      toast({
        title: t("safety.descriptionRequired"),
        description: t("safety.pleaseProvideDescription"),
        variant: "destructive",
      });
      return;
    }

    if (contactRequested && !contactDetails) {
      toast({
        title: t("safety.contactDetailsRequired"),
        description: t("safety.pleaseProvideContactDetails"),
        variant: "destructive",
      });
      return;
    }

    const reportData: ReportData = {
      reportType,
      description,
      urgency,
      contactRequested,
      contactMethod: contactRequested ? contactMethod : undefined,
      contactDetails: contactRequested ? contactDetails : undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    if (onSubmit) {
      onSubmit(reportData);
    }

    toast({
      title: t("safety.reportSubmitted"),
      description: t("safety.thankYouForReporting"),
    });
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "low":
        return <Flag className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          {t("safety.reportIssue")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-lg mb-2 block">
              {t("safety.whatHappened")}
            </Label>
            <RadioGroup
              value={reportType}
              onValueChange={setReportType}
              className="space-y-2"
            >
              {reportTypes[userType].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type}>{t(type)}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-lg mb-2 block">
              {t("safety.describeIssue")}
            </Label>
            <Textarea
              placeholder={t("safety.descriptionPlaceholder")}
              className="min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-lg mb-2 block">{t("safety.urgency")}</Label>
            <RadioGroup
              value={urgency}
              onValueChange={(value: "low" | "medium" | "high") =>
                setUrgency(value)
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="urgency-high" />
                <Label
                  htmlFor="urgency-high"
                  className="flex items-center gap-2"
                >
                  {getUrgencyIcon("high")}
                  {t("safety.urgencyHigh")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="urgency-medium" />
                <Label
                  htmlFor="urgency-medium"
                  className="flex items-center gap-2"
                >
                  {getUrgencyIcon("medium")}
                  {t("safety.urgencyMedium")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="urgency-low" />
                <Label
                  htmlFor="urgency-low"
                  className="flex items-center gap-2"
                >
                  {getUrgencyIcon("low")}
                  {t("safety.urgencyLow")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="contact-requested"
                checked={contactRequested}
                onCheckedChange={(checked) =>
                  setContactRequested(checked as boolean)
                }
              />
              <Label htmlFor="contact-requested">
                {t("safety.contactRequest")}
              </Label>
            </div>

            {contactRequested && (
              <div className="space-y-4 pl-6">
                <div>
                  <Label>{t("safety.contactMethod")}</Label>
                  <RadioGroup
                    value={contactMethod}
                    onValueChange={setContactMethod}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="contact-phone" />
                      <Label htmlFor="contact-phone">{t("safety.phone")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="contact-email" />
                      <Label htmlFor="contact-email">{t("safety.email")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inApp" id="contact-inapp" />
                      <Label htmlFor="contact-inapp">{t("safety.inApp")}</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>{t("safety.contactDetails")}</Label>
                  <Input
                    placeholder={t("safety.contactDetailsPlaceholder")}
                    value={contactDetails}
                    onChange={(e) => setContactDetails(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <Label className="text-lg mb-2 block">
              {t("safety.attachEvidence")}
            </Label>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mb-2"
            />
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted p-2 rounded"
                  >
                    <span className="text-sm truncate max-w-[80%]">
                      {file.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      {t("common.remove")}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                {t("common.cancel")}
              </Button>
            )}
            <Button onClick={handleSubmit}>{t("safety.submitReport")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportingSystem;
