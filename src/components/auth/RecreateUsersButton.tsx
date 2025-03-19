import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface RecreateUsersButtonProps {
  className?: string;
}

const RecreateUsersButton = ({ className = "" }: RecreateUsersButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRecreateUsers = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Recreating demo users",
        description: "This may take a few moments...",
      });

      // Call the edge function to recreate demo users
      const { data, error } = await supabase.functions.invoke(
        "recreate-demo-users",
        {
          method: "POST",
        },
      );

      if (error) {
        console.error("Error recreating demo users:", error);
        toast({
          variant: "destructive",
          title: "Error recreating demo users",
          description:
            error.message || "Failed to recreate users. Please try again.",
        });
        return;
      }

      console.log("Demo users recreated:", data);
      toast({
        title: "Demo users recreated successfully",
        description: "You can now log in with the demo credentials.",
      });

      // Display credentials toast
      setTimeout(() => {
        toast({
          title: "Demo Credentials",
          description:
            "Senior: martha@example.com / Helper: helper@example.com / Admin: admin@example.com (all use password123)",
          duration: 10000,
        });
      }, 1000);
    } catch (error: any) {
      console.error("Exception recreating demo users:", error);
      toast({
        variant: "destructive",
        title: "Error recreating demo users",
        description:
          error.message ||
          "An unexpected error occurred. Please check console for details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="default"
      className={`${className} py-6 h-auto text-lg font-medium`}
      onClick={handleRecreateUsers}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Creating Demo Accounts...
        </>
      ) : (
        "Create Demo Accounts"
      )}
    </Button>
  );
};

export default RecreateUsersButton;
