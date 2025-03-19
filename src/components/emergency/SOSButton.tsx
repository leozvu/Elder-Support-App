import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Phone, AlertTriangle, MapPin, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

export interface EmergencyContact {
  id?: string;
  name: string;
  phone: string;
  relationship: string;
}

interface SOSButtonProps {
  onActivate?: (contacts: EmergencyContact[]) => void;
  emergencyContacts?: EmergencyContact[];
  userLocation?: { latitude: number; longitude: number; address?: string };
  showLocationInfo?: boolean;
  userRole?: "elderly" | "helper" | "caregiver" | "admin";
}

const SOSButton = ({
  onActivate = (contacts) => console.log("SOS activated", contacts),
  emergencyContacts = [
    {
      id: "1",
      name: "John Smith",
      phone: "(555) 123-4567",
      relationship: "Son",
    },
    {
      id: "2",
      name: "Community Hub",
      phone: "(555) 987-6543",
      relationship: "Care Provider",
    },
    {
      id: "3",
      name: "Emergency Services",
      phone: "911",
      relationship: "Emergency",
    },
  ],
  userLocation = {
    latitude: 40.7128,
    longitude: -74.006,
    address: "123 Main Street, Anytown, USA",
  },
  showLocationInfo = true,
  userRole = "elderly",
}: SOSButtonProps) => {
  // Only show SOS button for elderly users
  if (userRole !== "elderly") {
    return null;
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [alertProgress, setAlertProgress] = useState(0);
  const [contactsNotified, setContactsNotified] = useState<string[]>([]);
  const { toast } = useToast();

  // Reset state when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setAlertSent(false);
      setAlertProgress(0);
      setContactsNotified([]);
    }
  }, [isDialogOpen]);

  // Simulate progress updates when alert is sent
  useEffect(() => {
    if (alertSent && alertProgress < 100) {
      const timer = setTimeout(() => {
        setAlertProgress((prev) => {
          const newProgress = prev + 20;

          // Simulate notifying contacts as progress increases
          if (newProgress === 40 && emergencyContacts.length > 0) {
            setContactsNotified([emergencyContacts[0].id || "0"]);
          } else if (newProgress === 60 && emergencyContacts.length > 1) {
            setContactsNotified((prev) => [
              ...prev,
              emergencyContacts[1].id || "1",
            ]);
          } else if (newProgress === 80 && emergencyContacts.length > 2) {
            setContactsNotified((prev) => [
              ...prev,
              emergencyContacts[2].id || "2",
            ]);
          }

          return newProgress;
        });
      }, 500);
      return () => clearTimeout(timer);
    }

    // When progress reaches 100%, show success toast
    if (alertProgress === 100) {
      toast({
        title: "Emergency Alert Sent",
        description: "All your emergency contacts have been notified.",
        variant: "default",
      });

      // Close dialog after a delay
      setTimeout(() => {
        setIsDialogOpen(false);
      }, 2000);
    }
  }, [alertSent, alertProgress, emergencyContacts, toast]);

  const handleSOSClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setIsActivated(true);
    setAlertSent(true);
    onActivate(emergencyContacts);

    // In a real implementation, this would trigger emergency protocols
    // Keep the button activated for longer to show it's in emergency mode
    setTimeout(() => {
      setIsActivated(false);
    }, 10000); // Reset after 10 seconds
  };

  const isContactNotified = (contactId?: string) => {
    return contactId ? contactsNotified.includes(contactId) : false;
  };

  return (
    <div className="bg-white">
      <motion.div
        whileTap={{ scale: 0.95 }}
        animate={
          isActivated
            ? {
                scale: [1, 1.1, 1],
                transition: { repeat: Infinity, duration: 1 },
              }
            : {}
        }
      >
        <Button
          variant="destructive"
          size="lg"
          className={`rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg ${isActivated ? "bg-red-700" : "bg-red-600 hover:bg-red-700"}`}
          onClick={handleSOSClick}
          aria-label="Emergency SOS Button"
        >
          <Phone className="h-8 w-8 mb-1" />
          <span className="text-lg font-bold">SOS</span>
        </Button>
      </motion.div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Emergency Assistance
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              This will alert your emergency contacts that you need immediate
              assistance.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {!alertSent ? (
            <>
              <div className="my-4 border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium text-lg mb-2">
                  Your emergency contacts:
                </h3>
                <ul className="space-y-3">
                  {emergencyContacts.map((contact) => (
                    <li key={contact.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{contact.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {contact.relationship}
                        </Badge>
                      </div>
                      <span className="text-gray-600">{contact.phone}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {showLocationInfo && (
                <div className="my-4 border rounded-md p-4 bg-blue-50">
                  <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Your current location:
                  </h3>
                  <p className="text-gray-700">{userLocation.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Coordinates: {userLocation.latitude.toFixed(6)},{" "}
                    {userLocation.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel className="text-lg py-6">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirm}
                  className="bg-red-600 hover:bg-red-700 text-lg py-6"
                >
                  Yes, Send Alert Now
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : (
            <div className="py-4">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Sending emergency alerts</span>
                  <span className="text-sm">{alertProgress}%</span>
                </div>
                <Progress value={alertProgress} className="h-2" />
              </div>

              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center justify-between p-3 rounded-md ${isContactNotified(contact.id) ? "bg-green-50" : "bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-2">
                      {isContactNotified(contact.id) ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <span className="font-medium">{contact.name}</span>
                        <div className="text-sm text-gray-500">
                          {contact.phone}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        isContactNotified(contact.id) ? "default" : "outline"
                      }
                      className={
                        isContactNotified(contact.id)
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {isContactNotified(contact.id) ? "Notified" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SOSButton;
