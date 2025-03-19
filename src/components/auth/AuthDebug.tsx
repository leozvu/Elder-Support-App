import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase, ensureDemoUsersExist } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DirectLoginTool from "./DirectLoginTool";
import DirectAuthDebug from "./DirectAuthDebug";
import { checkDemoUsers } from "@/lib/ensure-demo-users";

const AuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("test");
  const navigate = useNavigate();

  // Test direct login with martha@example.com
  const testDirectLogin = async () => {
    setIsLoading(true);
    setDebugInfo("Starting direct login test...\n");

    try {
      // Log Supabase URL (partially masked for security)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const maskedUrl = supabaseUrl
        ? supabaseUrl.substring(0, 8) +
          "..." +
          supabaseUrl.substring(supabaseUrl.length - 10)
        : "undefined";

      setDebugInfo((prev) => prev + `Supabase URL: ${maskedUrl}\n`);
      setDebugInfo(
        (prev) =>
          prev +
          `Supabase Anon Key defined: ${Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY)}\n`,
      );

      // Clear any existing session
      await supabase.auth.signOut();
      setDebugInfo((prev) => prev + "Cleared existing session\n");

      // Wait to ensure signOut completes
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Try to login with martha@example.com
      const email = "martha@example.com";
      const password = "password123";

      setDebugInfo((prev) => prev + `Attempting login with ${email}\n`);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setDebugInfo((prev) => prev + `ERROR: ${error.message}\n`);
        setDebugInfo(
          (prev) => prev + `Error details: ${JSON.stringify(error)}\n`,
        );
        return;
      }

      setDebugInfo((prev) => prev + "Login successful!\n");
      setDebugInfo((prev) => prev + `User ID: ${data.user?.id}\n`);
      setDebugInfo(
        (prev) => prev + `Session valid: ${Boolean(data.session)}\n`,
      );

      // Try to fetch user details
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user?.id)
        .single();

      if (userError) {
        setDebugInfo(
          (prev) =>
            prev + `Error fetching user details: ${userError.message}\n`,
        );
      } else {
        setDebugInfo(
          (prev) => prev + `User details: ${JSON.stringify(userData)}\n`,
        );
      }

      // Navigate to dashboard
      setDebugInfo(
        (prev) => prev + "Login successful! Redirecting to dashboard...\n",
      );

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setDebugInfo((prev) => prev + `EXCEPTION: ${error.message}\n`);
      console.error("Debug login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Force login with martha@example.com
  const forceLogin = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();

      // Wait to ensure signOut completes
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: "martha@example.com",
        password: "password123",
      });

      if (error) {
        alert(`Login failed: ${error.message}`);
        return;
      }

      // Navigate to dashboard
      navigate("/");
      window.location.reload();
    } catch (error: any) {
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check database for users
  const checkUsers = async () => {
    setIsLoading(true);
    setDebugInfo("Checking database for users...\n");

    try {
      // Check auth.users table (using service role if available)
      const { data: authUsers, error: authError } = await supabase
        .from("users")
        .select("id, email, full_name, role")
        .in("email", [
          "martha@example.com",
          "helper@example.com",
          "admin@example.com",
        ]);

      if (authError) {
        setDebugInfo(
          (prev) => prev + `ERROR querying users: ${authError.message}\n`,
        );
      } else {
        setDebugInfo(
          (prev) =>
            prev + `Found ${authUsers.length} users in public.users table:\n`,
        );
        authUsers.forEach((user) => {
          setDebugInfo(
            (prev) =>
              prev + `- ${user.email} (${user.role}) - ID: ${user.id}\n`,
          );
        });
      }

      // Check if we can get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      setDebugInfo(
        (prev) =>
          prev +
          `\nCurrent session: ${sessionData.session ? "Active" : "None"}\n`,
      );
    } catch (error: any) {
      setDebugInfo((prev) => prev + `EXCEPTION: ${error.message}\n`);
      console.error("Database check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create demo users
  const createDemoUsers = async () => {
    setIsLoading(true);
    setDebugInfo("Creating demo users...\n");

    try {
      // First check how many demo users exist
      const existingCount = await checkDemoUsers();
      setDebugInfo(
        (prev) => prev + `Found ${existingCount} existing demo users\n`,
      );

      // Create the demo users
      const success = await ensureDemoUsersExist();

      if (success) {
        setDebugInfo((prev) => prev + "Demo users created successfully!\n");

        // Check again to confirm
        const newCount = await checkDemoUsers();
        setDebugInfo((prev) => prev + `Now have ${newCount} demo users\n`);

        // List the users
        const { data: users } = await supabase
          .from("users")
          .select("id, email, role")
          .in("email", [
            "martha@example.com",
            "helper@example.com",
            "admin@example.com",
          ]);

        if (users && users.length > 0) {
          setDebugInfo((prev) => prev + "\nDemo users:\n");
          users.forEach((user) => {
            setDebugInfo(
              (prev) =>
                prev + `- ${user.email} (${user.role}) - ID: ${user.id}\n`,
            );
          });
        }
      } else {
        setDebugInfo((prev) => prev + "Failed to create demo users\n");
      }
    } catch (error: any) {
      setDebugInfo((prev) => prev + `EXCEPTION: ${error.message}\n`);
      console.error("Create demo users error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-primary">
          Authentication Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="test">Test Tools</TabsTrigger>
            <TabsTrigger value="direct">Client Login</TabsTrigger>
            <TabsTrigger value="api">Direct API</TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-4 pt-4">
            <Button
              onClick={createDemoUsers}
              className="w-full"
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? "Creating..." : "Create Demo Users"}
            </Button>

            <Button
              onClick={checkUsers}
              className="w-full"
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? "Checking..." : "Check Database Users"}
            </Button>

            <Button
              onClick={testDirectLogin}
              className="w-full"
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? "Testing..." : "Test Direct Login"}
            </Button>

            <Button
              onClick={forceLogin}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Force Login as Martha"}
            </Button>

            {debugInfo && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap overflow-auto max-h-60">
                {debugInfo}
              </div>
            )}
          </TabsContent>

          <TabsContent value="direct" className="pt-4">
            <DirectLoginTool />
          </TabsContent>

          <TabsContent value="api" className="pt-4">
            <DirectAuthDebug />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthDebug;
