import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, authError } = useAuth();
  const navigate = useNavigate();

  // Handle auth errors from context
  useEffect(() => {
    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || "Failed to sign in");
        setIsLoading(false);
        return;
      }
      
      // Navigate is handled by the auth system through the PublicRoute component
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      let demoEmail = "";
      
      switch (role) {
        case "elderly":
          demoEmail = "martha@example.com";
          break;
        case "helper":
          demoEmail = "helper@example.com";
          break;
        case "admin":
          demoEmail = "admin@example.com";
          break;
        default:
          demoEmail = "martha@example.com";
      }
      
      const { error } = await signIn(demoEmail, "password123");
      
      if (error) {
        setError(error.message || "Failed to sign in with demo account");
        setIsLoading(false);
        return;
      }
      
      // Navigate is handled by the auth system through the PublicRoute component
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="mb-2">Or use demo accounts:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin("elderly")}
                disabled={isLoading}
              >
                Elderly
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin("helper")}
                disabled={isLoading}
              >
                Helper
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin("admin")}
                disabled={isLoading}
              >
                Admin
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;