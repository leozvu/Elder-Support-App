import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || "Failed to sign in");
        return;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
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
        return;
      }
      
      toast({
        title: "Demo login successful",
        description: `Logged in as ${role} user`,
      });
      
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with demo accounts
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
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
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;