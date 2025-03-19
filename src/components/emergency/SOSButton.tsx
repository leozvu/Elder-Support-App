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
import { useAccessibility } from "@/components/accessibility/AccessibilityContext";
import { speak } from "@/lib/voice-guidance";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/local-database";

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
  userRole?: "elderly" | "helper" | "caregiver" | "admin" | "customer";
}

const SOSButton = ({
  onActivate = (contacts) => console.log("SOS activated", contacts),
  emergencyContacts,
  userLocation = {
    latitude: 40.7128,
    longitude: -74.006,
    address: "123 Main Street, Anytown, USA",
  },
  showLocationInfo = true,
  userRole,
}: SOSButtonProps) => {
  const { user, userDetails } = useAuth();
  const { settings } = useAccessibility();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [alertProgress, setAlertProgress] = useState(0);
  const [contactsNotified, setContactsNotified] = useState<string[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Determine the actual user role
  const actualUserRole = userRole || userDetails?.role || "customer";

  // Only show SOS button for elderly/customer users
  if (actualUserRole !== "elderly" && actualUserRole !== "customer") {
    return null;
  }

  // Load emergency contacts
  useEffect(() => {
    const loadEmergencyContacts = async () => {
      setLoading(true);
      try {
        if (emergencyContacts) {
          setContacts(emergencyContacts);
        } else {
          // In a real app, this would fetch from the database
          // For now, use mock data if not provided
          const mockContacts: EmergencyContact[] = [
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
          ];
          
          // Try to get from database if user is logged in
          if (user?.id) {
            try {
              const { data, error } = await db.from("emergency_contacts")
                .select("*")
                .eq("user_id", user.id);
                
              if (!error && data && data.length > 0) {
                setContacts(data.map(contact => ({
                  id: contact.id,
                  name: contact.name,
                  phone: contact.phone,
                  relationship: contact.relationship
                })));
              } else {
                setContacts(mockContacts);
              }
            } catch (err) {
              console.error("Error loading emergency contacts:", err);
              setContacts(mockContacts);
            }
          } else {
            setContacts(mockContacts);
          }
        }
      } catch (error) {
        console.error("Error loading emergency contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEmergencyContacts();
  }, [user?.id, emergencyContacts]);

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
          if (newProgress === 40 && contacts.length > 0) {
            setContactsNotified([contacts[0].id || "0"]);
            
            // Announce with voice guidance if enabled
            if (settings.voiceGuidance.enabled) {
              speak(`Notifying ${contacts[0].name}`);
            }
          } else if (newProgress === 60 && contacts.length > 1) {
            setContactsNotified((prev) => [
              ...prev,
              contacts[1].id || "1",
            ]);
            
            // Announce with voice guidance if enabled
            if (settings.voiceGuidance.enabled) {
              speak(`Notifying ${contacts[1].name}`);
            }
          } else if (newProgress === 80 && contacts.length > 2) {
            setContactsNotified((prev) => [
              ...prev,
              contacts[2].id || "2",
            ]);
            
            // Announce with voice guidance if enabled
            if (settings.voiceGuidance.enabled) {
              speak(`Notifying ${contacts[2].name}`);
            }
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
      
      // Announce with voice guidance if enabled
      if (settings.voiceGuidance.enabled) {
        speak("Emergency alert sent successfully. All your contacts have been notified.");
      }

      // Close dialog after a delay
      setTimeout(() => {
        setIsDialogOpen(false);
      }, 2000);
    }
  }, [alertSent, alertProgress, contacts, toast, settings.voiceGuidance.enabled]);

  const handleSOSClick = () => {
    setIsDialogOpen(true);
    
    // Announce with voice guidance if enabled
    if (settings.voiceGuidance.enabled) {
      speak("Emergency SOS button pressed. Confirm to send alert to your emergency contacts.");
    }
  };

  const handleConfirm = () => {
    setIsActivated(true);
    setAlertSent(true);
    onActivate(contacts);
    
    // Announce with voice guidance if enabled
    if (settings.voiceGuidance.enabled) {
      speak("Emergency alert confirmed. Sending notifications to your emergency contacts.");
    }

    // In a real implementation, this would trigger emergency protocols
    // Keep the button activated for longer to show it's in emergency mode
    setTimeout(() => {
      setIsActivated(false);
    }, 10000); // Reset after 10 seconds
    
    // Log the emergency event
    try {
      if (user?.id) {
        db.from("emergency_events").insert({
          user_id: user.id,
          timestamp: new Date().toISOString(),
          location: `${userLocation.latitude},${userLocation.longitude}`,
          address: userLocation.address,
          status: "initiated"
        });
      }
    } catch (error) {
      console.error("Error logging emergency event:", error);
    }
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
                {loading ? (
                  <p>Loading contacts...</p>
                ) : contacts.length > 0 ? (
                  <ul className="space-y-3">
                    {contacts.map((contact) => (
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
                ) : (
                  <p className="text-yellow-600">
                    No emergency contacts found. Please add contacts in your settings.
                  </p>
                )}
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
                  disabled={contacts.length === 0}
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
                {contacts.map((contact) => (
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