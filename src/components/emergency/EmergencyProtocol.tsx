import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Phone, Users, Bell, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface EmergencyProtocolProps {
  userId: string;
  userName: string;
  emergencyContacts: EmergencyContact[];
  onHubAlert?: () => void;
  onEmergencyServicesCall?: () => void;
  onContactsAlert?: (contactIds: string[]) => void;
  onCancel?: () => void;
}

const EmergencyProtocol = ({
  userId,
  userName,
  emergencyContacts,
  onHubAlert,
  onEmergencyServicesCall,
  onContactsAlert,
  onCancel,
}: EmergencyProtocolProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [hubResponseReceived, setHubResponseReceived] =
    useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [escalationTimer, setEscalationTimer] = useState<number>(30); // seconds
  const [showSafeWordDialog, setShowSafeWordDialog] = useState<boolean>(false);
  const [safeWord, setSafeWord] = useState<string>("");
  const [safeWordEntered, setSafeWordEntered] = useState<string>("");

  // Simulate hub response after 5 seconds
  useEffect(() => {
    if (activeStep === 1) {
      const timer = setTimeout(() => {
        if (Math.random() > 0.3) {
          // 70% chance of hub response
          setHubResponseReceived(true);
          toast({
            title: t("emergency.hubResponded"),
            description: t("emergency.hubRespondedDesc"),
          });
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeStep, t, toast]);

  // Escalation timer
  useEffect(() => {
    if (activeStep === 1 && !hubResponseReceived) {
      const timer = setInterval(() => {
        setEscalationTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setActiveStep(2); // Move to emergency contacts
            toast({
              title: t("emergency.escalating"),
              description: t("emergency.hubNotResponding"),
              variant: "destructive",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeStep, hubResponseReceived, t, toast]);

  // Update progress based on active step
  useEffect(() => {
    setProgress(activeStep * 33.33);
  }, [activeStep]);

  const handleHubAlert = () => {
    if (onHubAlert) onHubAlert();
    setActiveStep(1);
    toast({
      title: t("emergency.alertSent"),
      description: t("emergency.hubAlerted"),
    });
  };

  const handleEmergencyServicesCall = () => {
    if (onEmergencyServicesCall) onEmergencyServicesCall();
    setActiveStep(3);
    toast({
      title: t("emergency.emergencyServicesAlerted"),
      description: t("emergency.emergencyServicesDescription"),
      variant: "destructive",
    });
  };

  const handleContactsAlert = () => {
    if (selectedContacts.length === 0) {
      toast({
        title: t("emergency.selectContacts"),
        description: t("emergency.pleaseSelectContacts"),
        variant: "destructive",
      });
      return;
    }

    if (onContactsAlert) onContactsAlert(selectedContacts);
    setActiveStep(3);
    toast({
      title: t("emergency.contactsAlerted"),
      description: t("emergency.contactsAlertedDesc"),
    });
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId],
    );
  };

  const handleSafeWordSetup = () => {
    setShowSafeWordDialog(true);
  };

  const handleSafeWordSave = () => {
    if (safeWord.trim().length < 3) {
      toast({
        title: t("emergency.invalidSafeWord"),
        description: t("emergency.safeWordTooShort"),
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be saved to the user's profile
    toast({
      title: t("emergency.safeWordSet"),
      description: t("emergency.safeWordSetDesc"),
    });
    setShowSafeWordDialog(false);
  };

  const handleSafeWordUse = () => {
    if (safeWordEntered.trim() === safeWord.trim()) {
      // Trigger silent alert
      handleHubAlert();
      toast({
        title: t("emergency.silentAlertSent"),
        description: t("emergency.silentAlertDesc"),
        variant: "default",
      });
    } else {
      toast({
        title: t("emergency.incorrectSafeWord"),
        description: t("emergency.tryAgain"),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-6 w-6" />
            {t("emergency.emergencyProtocol")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
          </div>

          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {t("emergency.alertingHub")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {hubResponseReceived
                    ? t("emergency.hubRespondedWaiting")
                    : t("emergency.waitingForHubResponse", {
                        seconds: escalationTimer,
                      })}
                </p>

                {hubResponseReceived ? (
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="default"
                      className="gap-2"
                      onClick={() => setActiveStep(3)}
                    >
                      <MessageSquare className="h-5 w-5" />
                      {t("emergency.chatWithHub")}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setActiveStep(2)}
                    >
                      <Users className="h-5 w-5" />
                      {t("emergency.alertContacts")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="destructive"
                      className="gap-2"
                      onClick={handleEmergencyServicesCall}
                    >
                      <Phone className="h-5 w-5" />
                      {t("emergency.callEmergencyServices")}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setActiveStep(2)}
                    >
                      <Users className="h-5 w-5" />
                      {t("emergency.alertContacts")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {t("emergency.alertEmergencyContacts")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("emergency.selectContactsToAlert")}
                </p>
              </div>

              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer ${selectedContacts.includes(contact.id) ? "bg-primary/10 border-primary" : ""}`}
                    onClick={() => toggleContactSelection(contact.id)}
                  >
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">
                        {contact.relationship} • {contact.phone}
                      </p>
                    </div>
                    <div className="h-5 w-5 rounded-full border border-primary flex items-center justify-center">
                      {selectedContacts.includes(contact.id) && (
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={handleEmergencyServicesCall}
                >
                  <Phone className="h-5 w-5" />
                  {t("emergency.callEmergencyServices")}
                </Button>
                <Button
                  variant="default"
                  className="gap-2"
                  onClick={handleContactsAlert}
                >
                  <Bell className="h-5 w-5" />
                  {t("emergency.alertSelectedContacts")}
                </Button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6 text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
              <h3 className="text-2xl font-semibold">
                {t("emergency.helpIsOnTheWay")}
              </h3>
              <p className="text-gray-600">{t("emergency.stayCalm")}</p>

              <div className="pt-4">
                <Button variant="outline" onClick={onCancel}>
                  {t("emergency.close")}
                </Button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSafeWordSetup}
                className="text-sm text-gray-500"
              >
                {t("emergency.setupSafeWord")}
              </Button>

              {safeWord && (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder={t("emergency.enterSafeWord")}
                    value={safeWordEntered}
                    onChange={(e) => setSafeWordEntered(e.target.value)}
                    className="w-40 h-8 text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSafeWordUse}
                    className="h-8"
                  >
                    {t("emergency.use")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSafeWordDialog} onOpenChange={setShowSafeWordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("emergency.setupSafeWord")}</DialogTitle>
            <DialogDescription>
              {t("emergency.safeWordExplanation")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("emergency.safeWord")}</Label>
              <Input
                type="text"
                placeholder={t("emergency.safeWordPlaceholder")}
                value={safeWord}
                onChange={(e) => setSafeWord(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                {t("emergency.safeWordTip")}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setShowSafeWordDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSafeWordSave}>{t("common.save")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </div>
);

export default EmergencyProtocol;
