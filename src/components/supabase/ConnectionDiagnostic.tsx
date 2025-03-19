import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

const ConnectionDiagnostic = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [results, setResults] = useState<any[]>([]);
  const [envVars, setEnvVars] = useState<{ [key: string]: string | null }>({});

  const runDiagnostics = async () => {
    try {
      setStatus("loading");
      setResults([]);

      // Step 1: Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      setEnvVars({
        VITE_SUPABASE_URL: supabaseUrl ? "✓ Defined" : "✗ Missing",
        VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? "✓ Defined" : "✗ Missing",
      });

      addResult(
        "Environment Variables",
        supabaseUrl && supabaseAnonKey ? "success" : "error",
        `URL: ${supabaseUrl ? "Defined" : "Missing"}, Anon Key: ${supabaseAnonKey ? "Defined" : "Missing"}`,
      );

      // Step 2: Test direct database connection
      try {
        const { data, error } = await supabase
          .from("users")
          .select("count", { count: "exact", head: true });

        if (error) {
          addResult("Database Connection", "error", `Failed: ${error.message}`);
        } else {
          addResult(
            "Database Connection",
            "success",
            `Success: Found ${data?.count || 0} users`,
          );
        }
      } catch (dbError: any) {
        addResult(
          "Database Connection",
          "error",
          `Exception: ${dbError.message}`,
        );
      }

      // Step 3: Test edge function URL construction
      const functionUrl = `${supabaseUrl}/functions/v1/test-connection`;
      addResult("Edge Function URL", "info", functionUrl);

      // Step 4: Test edge function with fetch directly
      try {
        const response = await fetch(functionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          addResult(
            "Direct Edge Function Call",
            "error",
            `Failed with status ${response.status}: ${errorText}`,
          );
        } else {
          const data = await response.json();
          addResult(
            "Direct Edge Function Call",
            "success",
            `Success: ${JSON.stringify(data)}`,
          );
        }
      } catch (fetchError: any) {
        addResult(
          "Direct Edge Function Call",
          "error",
          `Network error: ${fetchError.message}`,
        );
      }

      // Step 5: Test edge function with Supabase client
      try {
        const { data, error } = await supabase.functions.invoke(
          "test-connection",
          {
            method: "POST",
          },
        );

        if (error) {
          addResult(
            "Supabase Client Edge Function Call",
            "error",
            `Failed: ${error.message}`,
          );
        } else {
          addResult(
            "Supabase Client Edge Function Call",
            "success",
            `Success: ${JSON.stringify(data)}`,
          );
        }
      } catch (edgeError: any) {
        addResult(
          "Supabase Client Edge Function Call",
          "error",
          `Exception: ${edgeError.message}`,
        );
      }

      setStatus("success");
    } catch (error: any) {
      console.error("Diagnostics failed:", error);
      setStatus("error");
      addResult("Overall Diagnostics", "error", `Failed: ${error.message}`);
    }
  };

  const addResult = (
    test: string,
    status: "success" | "error" | "info",
    message: string,
  ) => {
    setResults((prev) => [...prev, { test, status, message }]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Supabase Connection Diagnostics</span>
          {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={runDiagnostics}
            disabled={status === "loading"}
            className="w-full"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              "Run Comprehensive Diagnostics"
            )}
          </Button>

          {Object.keys(envVars).length > 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="font-medium mb-2">Environment Variables</h3>
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span>{key}:</span>
                  <span
                    className={
                      value?.includes("✗") ? "text-red-500" : "text-green-500"
                    }
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="font-medium">Diagnostic Results</h3>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md flex items-start gap-2 ${
                    result.status === "success"
                      ? "bg-green-50 border border-green-200"
                      : result.status === "error"
                        ? "bg-red-50 border border-red-200"
                        : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(result.status)}
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${
                        result.status === "success"
                          ? "text-green-800"
                          : result.status === "error"
                            ? "text-red-800"
                            : "text-blue-800"
                      }`}
                    >
                      {result.test}
                    </h4>
                    <p
                      className={`text-sm mt-1 ${
                        result.status === "success"
                          ? "text-green-700"
                          : result.status === "error"
                            ? "text-red-700"
                            : "text-blue-700"
                      }`}
                    >
                      {result.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mt-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">
                  Troubleshooting Tips
                </h3>
                <ul className="text-sm text-yellow-700 mt-2 list-disc pl-5 space-y-1">
                  <li>
                    Make sure your Supabase Edge Function is deployed correctly
                  </li>
                  <li>
                    Check that your environment variables are set correctly
                  </li>
                  <li>
                    Verify that CORS is properly configured in your Edge
                    Function
                  </li>
                  <li>
                    If using a service role key, ensure it has the correct
                    permissions
                  </li>
                  <li>
                    Try redeploying your Edge Function if it was recently
                    modified
                  </li>
                  <li>
                    Remember that the application will still work with mock data
                    if Supabase is unavailable
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionDiagnostic;
