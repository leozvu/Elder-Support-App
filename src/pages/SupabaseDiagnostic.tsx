import React from "react";
import Layout from "@/components/layout/Layout";
import ConnectionTest from "@/components/supabase/ConnectionTest";
import ConnectionDiagnostic from "@/components/supabase/ConnectionDiagnostic";
import SupabaseConnectionFixer from "@/components/supabase/SupabaseConnectionFixer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SupabaseDiagnostic = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">
          Supabase Connection Diagnostic
        </h1>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error Detected</AlertTitle>
          <AlertDescription>
            We've detected an issue with your Supabase connection. This tool
            will help diagnose and fix the problem.
          </AlertDescription>
        </Alert>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Environment Variables Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                First, let's verify that your Supabase environment variables are
                correctly set. These are required for connecting to your
                Supabase project.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800">
                      Environment Variables Status
                    </h3>
                    <p className="text-amber-700 text-sm mt-1">
                      The following environment variables should be set in your
                      project:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-amber-700 space-y-1">
                      <li>
                        <code>VITE_SUPABASE_URL</code> - Your Supabase project
                        URL
                      </li>
                      <li>
                        <code>VITE_SUPABASE_ANON_KEY</code> - Your Supabase
                        anonymous key
                      </li>
                    </ul>
                    <p className="text-amber-700 text-sm mt-2">
                      These variables are already set in the environment, but
                      they might be incorrect or the Supabase project might be
                      unavailable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="basic">Basic Connection Test</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Diagnostics</TabsTrigger>
            <TabsTrigger value="fixer">Connection Fixer</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <ConnectionTest />
          </TabsContent>

          <TabsContent value="advanced">
            <ConnectionDiagnostic />
          </TabsContent>

          <TabsContent value="fixer">
            <SupabaseConnectionFixer />
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-medium text-lg">If Connection Tests Fail:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Check Supabase Status:</strong> Visit the{" "}
                  <a
                    href="https://status.supabase.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Supabase Status Page
                  </a>{" "}
                  to see if there are any ongoing service disruptions.
                </li>
                <li>
                  <strong>Verify Project Settings:</strong> Ensure your Supabase
                  project is active and not paused.
                </li>
                <li>
                  <strong>Check Edge Functions:</strong> Make sure your edge
                  functions are properly deployed. You can redeploy them if
                  necessary.
                </li>
                <li>
                  <strong>CORS Configuration:</strong> Verify that CORS is
                  properly configured in your edge functions to allow requests
                  from your application.
                </li>
                <li>
                  <strong>Fallback to Mock Data:</strong> If you're unable to
                  resolve the connection issues, the application will
                  automatically fall back to using mock data for development
                  purposes.
                </li>
              </ol>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800">Note</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Even if Supabase connection fails, the application will
                      continue to function using mock data. This allows you to
                      develop and test the application without a working
                      Supabase connection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SupabaseDiagnostic;