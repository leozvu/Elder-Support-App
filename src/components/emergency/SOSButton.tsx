import React, { useState } from "react";
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
import { Phone, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SOSButtonProps {
  userRole?: string;
  onActivate?: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ 
  userRole = "customer",
  onActivate 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Mock emergency contacts
  const emergencyContacts = [
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

  const handleSOSClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    // Close the dialog
    setIsDialogOpen(false);
    
    // Show toast notification
    toast({
      title: "Emergency Alert Sent",
      description: "Your emergency contacts have been notified.",
      variant: "destructive",
    });
    
    // Call the onActivate callback if provided
    if (onActivate) {
      onActivate();
    }
    
    // In a real app, this would trigger emergency protocols
    console.log("SOS activated, contacting:", emergencyContacts);
  };

  // Only show SOS button for elderly/customer users
  if (userRole !== "elderly" && userRole !== "customer") {
    return null;
  }

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        className="rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg"
        onClick={handleSOSClick}
        aria-label="Emergency SOS Button"
      >
        <Phone className="h-6 w-6 mb-1" />
        <span className="text-sm font-bold">SOS</span>
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Emergency Assistance
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This will alert your emergency contacts that you need immediate
              assistance. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Your emergency contacts:</h3>
            <ul className="space-y-2">
              {emergencyContacts.map((contact) => (
                <li key={contact.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-xs ml-2 text-gray-500">
                      ({contact.relationship})
                    </span>
                  </div>
                  <span className="text-gray-600">{contact.phone}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Send Alert Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SOSButton;