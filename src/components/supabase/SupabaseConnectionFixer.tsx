import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const SupabaseConnectionFixer = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  const handleDeployEdgeFunctions = async () => {
    try {
      setIsDeploying(true);
      setDeploymentResult(null);

      // First, test if we can reach Supabase at all
      try {
        const { data, error } = await supabase
          .from("users")
          .select("count", { count: "exact", head: true });

        if (error) {
          console.warn("Database connection test failed:", error.message);
        } else {
          console.log("Database connection successful!");
        }
      } catch (dbError) {
        console.error("Exception during database test:", dbError);
      }

      // Attempt to invoke the test-connection function
      try {
        const { data, error } = await supabase.functions.invoke(
          "test-connection",
          {
            method: "POST",
          },
        );

        if (error) {
          console.error("Error invoking test-connection function:", error);
          setDeploymentResult({
            success: false,
            message: `Edge function test failed: ${error.message}`,
          });
        } else {
          console.log("Edge function test successful:", data);
          setDeploymentResult({
            success: true,
            message: "Edge functions are working correctly!",
          });
        }
      } catch (edgeError: any) {
        console.error("Exception invoking edge function:", edgeError);
        setDeploymentResult({
          success: false,
          message: `Edge function exception: ${edgeError.message}`,
        });
      }
    } catch (error: any) {
      console.error("Error in deployment process:", error);
      setDeploymentResult({
        success: false,
        message: `Deployment process error: ${error.message}`,
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleRecreateUsers = async () => {
    try {
      setIsDeploying(true);
      setDeploymentResult(null);

      toast({
        title: "Recreating demo users",
        description: "This may take a few moments...",
      });

      // Call the recreate-demo-users edge function
      const { data, error } = await supabase.functions.invoke(
        "recreate-demo-users",
        {
          body: {},
        },
      );

      if (error) {
        console.error("Error recreating demo users:", error);
        setDeploymentResult({
          success: false,
          message: `Failed to recreate users: ${error.message}`,
        });
        toast({
          variant: "destructive",
          title: "Error recreating demo users",
          description: error.message || "Failed to recreate users",
        });
      } else {
        console.log("Demo users recreated successfully:", data);
        setDeploymentResult({
          success: true,
          message: "Demo users recreated successfully!",
        });
        toast({
          title: "Success",
          description: "Demo users have been recreated successfully",
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
      }
    } catch (error: any) {
      console.error("Exception recreating demo users:", error);
      setDeploymentResult({
        success: false,
        message: `Exception: ${error.message}`,
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Connection Fixer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">
                  Connection Issues
                </h3>
                <p className="text-amber-700 text-sm mt-1">
                  If you're experiencing connection issues with Supabase, try
                  the following steps to fix them:
                </p>
                <ol className="list-decimal pl-5 mt-2 text-sm text-amber-700 space-y-1">
                  <li>Test edge functions to verify connectivity</li>
                  <li>Recreate demo users if the database is empty</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Test Edge Functions</h3>
              <p className="text-gray-600 mb-4">
                This will test if your edge functions are properly deployed and
                accessible.
              </p>
              <Button
                onClick={handleDeployEdgeFunctions}
                disabled={isDeploying}
                className="w-full"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Edge Functions...
                  </>
                ) : (
                  "Test Edge Functions"
                )}
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Recreate Demo Users</h3>
              <p className="text-gray-600 mb-4">
                This will recreate the demo users in your Supabase database.
              </p>
              <Button
                onClick={handleRecreateUsers}
                disabled={isDeploying}
                className="w-full"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recreating Demo Users...
                  </>
                ) : (
                  "Recreate Demo Users"
                )}
              </Button>
            </div>
          </div>

          {deploymentResult && (
            <div
              className={`p-4 rounded-md ${deploymentResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <div className="flex items-start">
                {deploymentResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                )}
                <div>
                  <h3
                    className={`font-medium ${deploymentResult.success ? "text-green-800" : "text-red-800"}`}
                  >
                    {deploymentResult.success ? "Success" : "Error"}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${deploymentResult.success ? "text-green-700" : "text-red-700"}`}
                  >
                    {deploymentResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionFixer;
