import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertTriangle,
  Phone,
  MessageSquare,
  User,
  MapPin,
  Clock,
} from "lucide-react";

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
  onCancel?: () => void;
}

const EmergencyProtocol: React.FC<EmergencyProtocolProps> = ({
  userId,
  userName,
  emergencyContacts,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [emergencyType, setEmergencyType] = useState<string>("medical");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const handleEmergencySubmit = async () => {
    if (!description) {
      toast({
        variant: "destructive",
        title: t("emergency.descriptionRequired"),
        description: t("emergency.pleaseProvideDescription"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would call an emergency service API
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: t("emergency.alertSent"),
        description: t("emergency.helpOnTheWay"),
      });

      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      toast({
        variant: "destructive",
        title: t("emergency.alertFailed"),
        description: t("emergency.pleaseTryAgain"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallEmergencyServices = () => {
    // In a real app, this would use a native API to initiate a phone call
    // For web, we'll just open the dialer with the emergency number
    window.location.href = "tel:911";
  };

  return (
    <Card className="border-red-200">
      <CardHeader className="bg-red-50 border-b border-red-200">
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-6 w-6" />
          {t("emergency.emergencyProtocol")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">
                  {t("emergency.emergencySituation")}
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  {t("emergency.useThisForUrgent")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("emergency.typeOfEmergency")}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={emergencyType === "medical" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setEmergencyType("medical")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {t("emergency.medical")}
                </Button>
                <Button
                  type="button"
                  variant={emergencyType === "safety" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setEmergencyType("safety")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {t("emergency.safety")}
                </Button>
                <Button
                  type="button"
                  variant={emergencyType === "fall" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setEmergencyType("fall")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {t("emergency.fall")}
                </Button>
                <Button
                  type="button"
                  variant={emergencyType === "other" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setEmergencyType("other")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {t("emergency.other")}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("emergency.describeEmergency")}
              </h3>
              <Textarea
                placeholder={t("emergency.describeSituation")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("emergency.yourLocation")}
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder={t("emergency.enterLocation")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" className="flex-shrink-0">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t("emergency.useCurrentLocation")}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("emergency.contactEmergencyServices")}
              </h3>
              <Button
                variant="destructive"
                className="w-full py-6 text-lg"
                onClick={handleCallEmergencyServices}
              >
                <Phone className="h-5 w-5 mr-2" />
                {t("emergency.call911")}
              </Button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {t("emergency.callDirectly")}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("emergency.notifyContacts")}
              </h3>
              <div className="space-y-2">
                {emergencyContacts.map((contact) => (
                  <Button
                    key={contact.id}
                    variant={
                      selectedContact === contact.id ? "default" : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() =>
                      setSelectedContact(
                        selectedContact === contact.id ? null : contact.id,
                      )
                    }
                  >
                    <User className="h-4 w-4 mr-2" />
                    <div className="flex flex-col items-start">
                      <span>{contact.name}</span>
                      <span className="text-xs opacity-70">
                        {contact.relationship} • {contact.phone}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleEmergencySubmit}
              disabled={isSubmitting}
              className="py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  {t("emergency.sendingAlert")}
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {t("emergency.sendEmergencyAlert")}
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
            )}
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">
                  {t("emergency.responseTime")}
                </h3>
                <p className="text-amber-700 text-sm mt-1">
                  {t("emergency.responseTimeDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyProtocol;