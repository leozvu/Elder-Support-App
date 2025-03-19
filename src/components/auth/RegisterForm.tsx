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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const formSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
      message: "Please enter a valid phone number.",
    }),
    address: z.string().min(5, {
      message: "Please enter your full address.",
    }),
    userType: z.enum(["elderly", "helper"]),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface RegisterFormProps {
  onRegister?: (values: z.infer<typeof formSchema>) => void;
}

const RegisterForm = ({ onRegister = () => {} }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      userType: "elderly",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Registration form submitted with email:", values.email);
      setErrorMessage(null);
      setIsSubmitting(true);

      const { error, data } = await signUp(values.email, values.password, {
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        userType: values.userType,
      });

      if (error) {
        console.error("Registration error:", error.message);
        setErrorMessage(error.message || "Registration failed");
        return;
      }

      console.log("Registration successful, navigating to login");
      onRegister(values);
      navigate("/login");
    } catch (error: any) {
      console.error("Exception during registration:", error);
      setErrorMessage(error.message || "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">
          Create Your Account
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
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg">I am a:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="elderly" id="elderly" />
                        <label
                          htmlFor="elderly"
                          className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Senior seeking assistance
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="helper" id="helper" />
                        <label
                          htmlFor="helper"
                          className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Helper providing assistance
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Smith"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(555) 123-4567"
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St, City, State"
                        className="text-lg p-6 h-14"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Confirm Password</FormLabel>
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
            </div>

            <Button
              type="submit"
              className="w-full text-lg py-6 h-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center mt-4">
              <Button
                variant="link"
                className="text-base text-primary"
                onClick={() => navigate("/login")}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
