import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import DemoLoginButton from "./DemoLoginButton";
import DirectDemoLoginButton from "./DirectDemoLoginButton";
import LocalDemoLoginButton from "./LocalDemoLoginButton";
import RecreateUsersButton from "./RecreateUsersButton";
import ConnectionTestButton from "./ConnectionTestButton";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import AuthDebug from "./AuthDebug";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

interface LoginFormProps {
  onLogin?: (values: z.infer<typeof formSchema>) => void;
  userType?: "elderly" | "helper" | "admin";
}

const LoginForm = ({
  onLogin = () => {},
  userType = "elderly",
}: LoginFormProps) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Login form submitted with email:", values.email);
      setErrorMessage(null);
      setIsSubmitting(true);

      // First sign out to clear any existing session
      await supabase.auth.signOut();

      // Clear local storage to ensure clean state
      localStorage.removeItem("senior_assist_auth");
      localStorage.removeItem("supabase.auth.token");

      // Clear any other potential auth storage items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("supabase") || key.includes("auth"))) {
          console.log("Clearing potential auth item:", key);
          localStorage.removeItem(key);
        }
      }

      // Wait to ensure signOut completes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        console.log("Attempting direct login with", values.email);

        // Try using the direct API approach first
        const { directSignIn } = await import("@/lib/direct-auth");
        const directResult = await directSignIn(values.email, values.password);

        if (directResult.success) {
          console.log("Direct API login successful!");
          onLogin(values);
          navigate("/");

          // Add a longer delay before reloading to ensure navigation completes
          setTimeout(() => {
            console.log("Reloading page to refresh auth state");
            window.location.reload(); // Force reload to ensure auth state is updated
          }, 1000);
          return;
        }

        console.log("Direct API login failed, falling back to client library");
        console.log("Failure reason:", directResult.error);

        // Fall back to Supabase client library with retry mechanism
        let retryCount = 0;
        const maxRetries = 3;
        let authResult;

        while (retryCount <= maxRetries) {
          try {
            console.log(
              `Attempt ${retryCount + 1}/${maxRetries + 1} to sign in with Supabase client`,
            );

            // Create a fresh client for each attempt
            const freshClient = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY,
              {
                auth: {
                  persistSession: true,
                  autoRefreshToken: true,
                  detectSessionInUrl: true,
                },
              },
            );

            authResult = await freshClient.auth.signInWithPassword({
              email: values.email,
              password: values.password,
              options: {
                redirectTo: window.location.origin,
              },
            });

            if (!authResult.error) {
              console.log("Sign in successful with fresh client");
              break;
            }

            console.log(
              `Retry ${retryCount + 1}/${maxRetries} failed:`,
              authResult.error.message,
            );
            retryCount++;

            if (retryCount <= maxRetries) {
              await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait 1.5 seconds before retry
            }
          } catch (retryError) {
            console.error("Error during retry:", retryError);
            retryCount++;
          }
        }

        const { data, error } = authResult || {
          data: null,
          error: { message: "Authentication failed after retries" },
        };

        if (error) {
          console.error("Login error:", error.message);
          console.error("Error details:", JSON.stringify(error));
          setErrorMessage(error.message || "Invalid email or password");
          setIsSubmitting(false);
          return;
        }

        console.log("Login successful, user ID:", data.user?.id);
        console.log("Session valid:", Boolean(data.session));
        onLogin(values);

        // Try to fetch user details to verify everything is working
        if (data.user) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (userError) {
            console.warn("Could not fetch user details:", userError.message);
          } else {
            console.log("User details fetched successfully:", userData);
          }
        }

        // Navigate to dashboard
        navigate("/");

        // Add a longer delay before reloading to ensure navigation completes
        setTimeout(() => {
          console.log("Reloading page to refresh auth state");
          window.location.reload(); // Force reload to ensure auth state is updated
        }, 1000);
      } catch (innerError: any) {
        console.error("Inner exception during login:", innerError);
        setErrorMessage(
          innerError.message ||
            "An error occurred during login. Please try again.",
        );
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("Exception during login:", error);
      setErrorMessage(
        error.message || "An error occurred during login. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            {userType === "elderly"
              ? "Senior Assist Login"
              : userType === "helper"
                ? "Helper Login"
                : "Hub Admin Login"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {errorMessage && (
                <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                  {errorMessage}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        className="text-lg p-6 h-14"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="text-lg p-6 h-14"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full text-lg py-6 h-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center mt-4">
                <Button
                  variant="link"
                  className="text-base text-primary"
                  onClick={() => navigate("/register")}
                >
                  Don't have an account? Register here
                </Button>
              </div>

              <div className="pt-4 border-t mt-4">
                <p className="text-sm font-medium text-center mb-2">
                  Offline mode (no Supabase):
                </p>
                <div className="flex flex-col gap-2">
                  <LocalDemoLoginButton
                    userType="customer"
                    className="w-full"
                  />
                  <LocalDemoLoginButton userType="helper" className="w-full" />
                  <LocalDemoLoginButton userType="admin" className="w-full" />
                </div>

                <p className="text-sm font-medium text-center mt-4 mb-2">
                  Supabase account creation:
                </p>
                <div className="flex flex-col gap-2">
                  <RecreateUsersButton className="w-full" />
                  <ConnectionTestButton className="w-full mt-2" />
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-700 font-medium">
                    Supabase Connection Note
                  </p>
                  <p className="text-sm text-yellow-600">
                    If Supabase connection fails, you can use the offline mode
                    buttons above.
                  </p>
                </div>
              </div>

              <div className="text-center mt-4">
                <Button
                  variant="link"
                  className="text-xs text-gray-400"
                  onClick={() => setShowDebug(!showDebug)}
                >
                  {showDebug ? "Hide Debug Tools" : "Show Debug Tools"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {showDebug && (
        <div className="mt-4">
          <AuthDebug />
        </div>
      )}
    </>
  );
};

export default LoginForm;
