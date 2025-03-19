import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  directSignIn,
  directCreateUser,
  createDemoUsersDirect,
} from "@/lib/direct-auth";
import { useNavigate } from "react-router-dom";

const DirectAuthDebug = () => {
  const [email, setEmail] = useState("martha@example.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const navigate = useNavigate();

  const handleDirectLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setResult("Attempting direct API login...\n");

    try {
      // Log environment info
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const hasAnonKey = Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);

      setResult(
        (prev) => prev + `Supabase URL defined: ${Boolean(supabaseUrl)}\n`,
      );
      setResult((prev) => prev + `Supabase Anon Key defined: ${hasAnonKey}\n`);

      // Attempt login using direct API
      setResult((prev) => prev + `Attempting login with ${email}\n`);

      const authResult = await directSignIn(email, password);

      if (!authResult.success) {
        setResult((prev) => prev + `ERROR: ${authResult.error}\n`);
        setResult((prev) => prev + `Status code: ${authResult.statusCode}\n`);
        setResult(
          (prev) =>
            prev + `Error details: ${JSON.stringify(authResult.data)}\n`,
        );
        return;
      }

      setResult((prev) => prev + "Direct API login successful!\n");
      setResult(
        (prev) =>
          prev +
          `Access token received: ${authResult.data.access_token.substring(0, 10)}...\n`,
      );
      setResult((prev) => prev + `Token type: ${authResult.data.token_type}\n`);
      setResult(
        (prev) => prev + `Expires in: ${authResult.data.expires_in} seconds\n`,
      );

      // Navigate to dashboard
      setResult(
        (prev) => prev + "Login successful! Redirecting to dashboard...\n",
      );

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setResult((prev) => prev + `EXCEPTION: ${error.message}\n`);
      console.error("Direct API login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDemoUsers = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setResult("Creating demo users via direct API...\n");

    try {
      const success = await createDemoUsersDirect();

      if (success) {
        setResult((prev) => prev + "Successfully created demo users!\n");
      } else {
        setResult(
          (prev) =>
            prev +
            "Failed to create some demo users. Check console for details.\n",
        );
      }
    } catch (error: any) {
      setResult((prev) => prev + `EXCEPTION: ${error.message}\n`);
      console.error("Create demo users error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-primary">
          Direct API Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="direct-email">Email</Label>
          <Input
            id="direct-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="direct-password">Password</Label>
          <Input
            id="direct-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>

        <Button
          onClick={handleDirectLogin}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Login via Direct API"}
        </Button>

        <Button
          onClick={handleCreateDemoUsers}
          className="w-full"
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Demo Users via API"}
        </Button>

        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap overflow-auto max-h-60">
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DirectAuthDebug;
