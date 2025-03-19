import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const ConnectionTest = () => {
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [testResult, setTestResult] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      setTestStatus("testing");
      setTestResult(null);

      // Test basic connection to Supabase
      const { data, error } = await supabase.from("users").select("count", {
        count: "exact",
        head: true,
      });

      if (error) {
        console.error("Connection test failed:", error);
        setTestStatus("error");
        setTestResult(`Connection failed: ${error.message}`);
        return;
      }

      // If we get here, connection was successful
      setTestStatus("success");
      setTestResult(
        `Connection successful! Found ${data?.count || 0} users in database.`,
      );
    } catch (error: any) {
      console.error("Connection test error:", error);
      setTestStatus("error");
      setTestResult(`Error: ${error.message}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Supabase Connection Test</span>
          {testStatus !== "idle" && (
            <Badge
              variant="outline"
              className={
                testStatus === "testing"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : testStatus === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {testStatus === "testing"
                ? "Testing..."
                : testStatus === "success"
                  ? "Connected"
                  : "Failed"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            This simple test will check if your application can connect to your
            Supabase project.
          </p>

          <Button
            onClick={testConnection}
            disabled={testStatus === "testing"}
            className="w-full"
          >
            {testStatus === "testing" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>

          {testResult && (
            <div
              className={`p-4 rounded-md ${
                testStatus === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start">
                {testStatus === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                )}
                <p
                  className={
                    testStatus === "success" ? "text-green-700" : "text-red-700"
                  }
                >
                  {testResult}
                </p>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-4">
            <p>
              Note: If the connection test fails, the application will still
              function using mock data. This allows you to continue development
              without a working Supabase connection.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionTest;