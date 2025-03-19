import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ConnectionTest = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const recreateUsers = async () => {
    try {
      setStatus("loading");
      setErrorMessage(null);

      // Call the recreate-demo-users edge function
      const { data, error } = await supabase.functions.invoke(
        "recreate-demo-users",
        { method: "POST" },
      );

      if (error) {
        console.error("Error recreating users:", error);
        setStatus("error");
        setErrorMessage(`Failed to recreate users: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Error recreating users",
          description: error.message,
        });
        return;
      }

      // If we got here, the operation was successful
      setStatus("success");
      console.log("Users recreated successfully:", data);
      toast({
        title: "Success",
        description: "Demo users have been recreated successfully",
      });

      // Show credentials
      setTimeout(() => {
        toast({
          title: "Demo Credentials",
          description:
            "Senior: martha@example.com / Helper: helper@example.com / Admin: admin@example.com (all use password123)",
          duration: 10000,
        });
      }, 1000);
    } catch (error: any) {
      console.error("Connection test failed:", error);
      setStatus("error");
      setErrorMessage(error.message || "Unknown error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button
          onClick={recreateUsers}
          disabled={status === "loading"}
          className="w-full"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Recreating Users...
            </>
          ) : (
            "Recreate Demo Users"
          )}
        </Button>
      </div>

      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Operation Failed</h3>
              <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">
                Users Recreated Successfully
              </h3>
              <p className="text-green-700 text-sm mt-1">
                Demo users have been recreated in your Supabase database. You
                can now log in with the demo credentials.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;
