import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  serviceTitle: z.string().min(2, {
    message: "Service title must be at least 2 characters.",
  }),
  serviceDate: z.date({
    required_error: "Please select a date.",
  }),
  serviceTime: z.string({
    required_error: "Please select a time.",
  }),
  serviceLocation: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  serviceDetails: z.string().min(10, {
    message: "Please provide more details about your request.",
  }),
});

type ServiceDetailsFormProps = {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
};

const ServiceDetailsForm = ({
  onSubmit = () => {},
  defaultValues = {
    serviceTitle: "",
    serviceDate: new Date(),
    serviceTime: "10:00",
    serviceLocation: "",
    serviceDetails: "",
  },
}: ServiceDetailsFormProps) => {
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  const toggleVoiceInput = () => {
    setIsVoiceInputActive(!isVoiceInputActive);
    // In a real implementation, this would activate voice recognition
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Service Request Details
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="serviceTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-medium">
                  What service do you need?
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., Grocery shopping, Doctor's appointment"
                    className="text-lg p-6 h-14"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-base">
                  Enter a brief title for the service you need.
                </FormDescription>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="serviceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xl font-medium">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "text-lg p-6 h-14 w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-6 w-6 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-medium">Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="text-lg p-6 h-14"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="serviceLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-medium">Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter address or location"
                    className="text-lg p-6 h-14"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-base">
                  Where should the helper meet you?
                </FormDescription>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceDetails"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-xl font-medium">
                    Additional Details
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-12 w-12",
                      isVoiceInputActive &&
                        "bg-primary text-primary-foreground",
                    )}
                    onClick={toggleVoiceInput}
                  >
                    <Mic className="h-6 w-6" />
                    <span className="sr-only">Voice input</span>
                  </Button>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Please provide any additional details about your request"
                    className="text-lg p-4 min-h-[150px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-base">
                  {isVoiceInputActive
                    ? "Speak now... Voice input is active"
                    : "Include any special instructions or requirements."}
                </FormDescription>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="text-xl py-6 px-10 h-auto w-full md:w-auto"
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ServiceDetailsForm;
