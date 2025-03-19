import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Phone, X } from "lucide-react";

interface EmergencySOSButtonProps {
  onActivate?: () => void;
  emergencyContacts?: {
    name: string;
    phone: string;
    relationship: string;
  }[];
  className?: string;
}

const EmergencySOSButton = ({
  onActivate = () => {},
  emergencyContacts = [],
  className = "",
}: EmergencySOSButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isActivated, setIsActivated] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [countdownInterval, setCountdownInterval] = useState<number | null>(
    null,
  );

  const handleSOSPress = () => {
    setIsPressed(true);
    setIsConfirmDialogOpen(true);

    // Start countdown
    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          activateEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setCountdownInterval(interval);
  };

  const cancelSOS = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    setIsPressed(false);
    setCountdown(5);
    setIsConfirmDialogOpen(false);
  };

  const activateEmergency = () => {
    setIsActivated(true);
    setIsConfirmDialogOpen(false);
    onActivate();

    // In a real app, this would trigger emergency protocols
    // such as calling emergency contacts, sending location data, etc.
  };

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        className={`relative rounded-full p-8 h-auto w-auto ${className} ${isActivated ? "animate-pulse" : ""}`}
        onClick={handleSOSPress}
      >
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          <div className="text-3xl font-bold">SOS</div>
        </div>
        <AlertTriangle className="h-10 w-10 absolute opacity-0" />
      </Button>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-red-600 flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Emergency SOS
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              {countdown > 0 ? (
                <>
                  <p className="mb-2">
                    Emergency services will be contacted in
                  </p>
                  <p className="text-4xl font-bold text-red-600">
                    {countdown} seconds
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-red-600">
                  Emergency services are being contacted
                </p>
              )}
            </DialogDescription>
          </DialogHeader>

          {countdown > 0 && (
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={cancelSOS}
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={activateEmergency}
              >
                <AlertTriangle className="h-4 w-4 mr-2" /> Activate Now
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isActivated} onOpenChange={setIsActivated}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-red-600 flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Emergency Activated
            </DialogTitle>
            <DialogDescription className="text-center">
              <p className="mb-4">
                Your emergency contacts are being notified. Help is on the way.
              </p>
              <div className="animate-pulse bg-red-100 text-red-800 p-3 rounded-md mb-4">
                Your location has been shared with emergency services.
              </div>
            </DialogDescription>
          </DialogHeader>

          {emergencyContacts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Contacting:</h3>
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500">
                      {contact.relationship}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" /> {contact.phone}
                  </Button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsActivated(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencySOSButton;
