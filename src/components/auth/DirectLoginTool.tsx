import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const DirectLoginTool = () => {
  const [email, setEmail] = useState("martha@example.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const navigate = useNavigate();

  const handleDirectLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setResult("Attempting direct login...\n");

    try {
      // Log environment info
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const hasAnonKey = Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);

      setResult(
        (prev) => prev + `Supabase URL defined: ${Boolean(supabaseUrl)}\n`,
      );
      setResult((prev) => prev + `Supabase Anon Key defined: ${hasAnonKey}\n`);

      // Clear any existing session
      await supabase.auth.signOut();
      setResult((prev) => prev + "Cleared existing session\n");

      // Wait to ensure signOut completes
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Attempt login
      setResult((prev) => prev + `Attempting login with ${email}\n`);
      console.log(`DirectLoginTool: Attempting login with ${email}`);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setResult((prev) => prev + `ERROR: ${error.message}\n`);
        setResult((prev) => prev + `Error details: ${JSON.stringify(error)}\n`);
        return;
      }

      setResult((prev) => prev + "Login successful!\n");
      setResult((prev) => prev + `User ID: ${data.user?.id}\n`);
      setResult((prev) => prev + `Session valid: ${Boolean(data.session)}\n`);

      // Try to fetch user details
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user?.id)
        .single();

      if (userError) {
        setResult(
          (prev) =>
            prev + `Error fetching user details: ${userError.message}\n`,
        );
      } else {
        setResult(
          (prev) => prev + `User details: ${JSON.stringify(userData)}\n`,
        );
      }

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
      console.error("Direct login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-primary">
          Direct Login Tool
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
          {isLoading ? "Logging in..." : "Direct Login"}
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

export default DirectLoginTool;
