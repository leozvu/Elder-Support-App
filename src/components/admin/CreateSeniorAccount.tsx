import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface CreateSeniorAccountProps {
  defaultEmail?: string;
  onSuccess?: (userId: string) => void;
  className?: string;
}

const CreateSeniorAccount = ({
  defaultEmail = "",
  onSuccess,
  className = "",
}: CreateSeniorAccountProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    userId?: string;
  } | null>(null);
  const { toast } = useToast();

  const handleCreateAccount = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter an email address",
      });
      return;
    }

    try {
      setIsLoading(true);
      setResult(null);

      // Call the create-senior-account edge function
      const { data, error } = await supabase.functions.invoke(
        "create-senior-account",
        {
          body: {
            email,
            password,
            fullName: fullName || "Senior User",
          },
        },
      );

      if (error) {
        console.error("Error creating senior account:", error);
        setResult({
          success: false,
          message: `Failed to create account: ${error.message}`,
        });
        toast({
          variant: "destructive",
          title: "Error creating account",
          description: error.message || "Failed to create senior account",
        });
        return;
      }

      console.log("Senior account created successfully:", data);
      setResult({
        success: true,
        message: "Senior account created successfully!",
        userId: data.user?.id,
      });
      toast({
        title: "Success",
        description: "Senior account has been created successfully",
      });

      if (onSuccess && data.user?.id) {
        onSuccess(data.user.id);
      }

      // Display credentials toast
      setTimeout(() => {
        toast({
          title: "Account Credentials",
          description: `Email: ${email} / Password: ${password}`,
          duration: 10000,
        });
      }, 1000);
    } catch (error: any) {
      console.error("Exception creating senior account:", error);
      setResult({
        success: false,
        message: `Exception: ${error.message}`,
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If defaultEmail is provided, create the account automatically
  React.useEffect(() => {
    if (defaultEmail && !result) {
      handleCreateAccount();
    }
  }, [defaultEmail]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>Create Senior Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="senior@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name (Optional)</Label>
            <Input
              id="fullName"
              placeholder="Senior User"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              Default password: password123
            </p>
          </div>

          <Button
            onClick={handleCreateAccount}
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Senior Account"
            )}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-md ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <div className="flex items-start">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                )}
                <div>
                  <h3
                    className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}
                  >
                    {result.success ? "Success" : "Error"}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${result.success ? "text-green-700" : "text-red-700"}`}
                  >
                    {result.message}
                  </p>
                  {result.success && (
                    <p className="text-sm mt-2 text-green-700">
                      Account created with email: {email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateSeniorAccount;
