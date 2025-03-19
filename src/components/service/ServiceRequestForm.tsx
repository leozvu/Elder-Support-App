import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import AddressAutocomplete from "@/components/maps/AddressAutocomplete";
import GoogleMapWrapper from "@/components/maps/GoogleMapWrapper";
import { speak } from "@/lib/voice-guidance";

// Service types
const Types = [
  { id: "grocery", name: "Grocery Shopping" },
  { id: "medical", name: "Medical Appointment" },
  { id: "housekeeping", name: "Light Housekeeping" },
  { id: "companionship", name: "Companionship" },
  { id: "transportation", name: "Transportation" },
  { id: "meal", name: "Meal Preparation" },
  { id: "technology", name: "Technology Assistance" },
  { id: "other", name: "Other Services" },
];

// Time options
const timeOptions = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Form schema
const formSchema = z.object({
  serviceType: z.string({
    required_error: "Please select a service type",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters",
  }),
  duration: z
    .number()
    .min(30, { message: "Minimum duration is 30 minutes" })
    .max(480, { message: "Maximum duration is 8 hours" }),
  details: z.string().optional(),
  includeUserPreferences: z.boolean().default(true),
  specificNeeds: z.array(z.string()).optional(),
  caregiverNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ServiceRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [addressCoordinates, setAddressCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      date: undefined,
      time: "",
      address: "",
      duration: 60,
      details: "",
      includeUserPreferences: true,
      specificNeeds: [],
      caregiverNotes: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      speak(
        "Your service request has been submitted successfully. You will be notified when a helper is assigned.",
        true,
      );
      // Reset form
      form.reset();
      setAddressCoordinates(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      speak(
        "There was an error submitting your request. Please try again.",
        true,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle address change with coordinates
  const handleAddressChange = (
    address: string,
    coordinates?: { lat: number; lng: number },
  ) => {
    form.setValue("address", address);
    if (coordinates) {
      setAddressCoordinates(coordinates);
    } else {
      setAddressCoordinates(null);
    }
  };

  // Announce form on mount
  useEffect(() => {
    speak(
      "Service request form loaded. Please fill in the details to request assistance.",
    );
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Request Assistance
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Types.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() ||
                          date >
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 3),
                            )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                        <Clock className="ml-auto h-4 w-4 opacity-50" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {format(new Date(`2000-01-01T${time}`), "h:mm a")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    value={field.value}
                    onChange={handleAddressChange}
                    placeholder="Enter the service address"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  This is where the helper will provide the service
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Map preview when address is selected */}
          {addressCoordinates && (
            <div className="mt-2 mb-4">
              <GoogleMapWrapper
                center={addressCoordinates}
                zoom={16}
                height="200px"
                locations={[
                  {
                    id: "service-location",
                    name: "Service Location",
                    address: form.getValues().address,
                    position: addressCoordinates,
                    type: "service",
                  },
                ]}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="30"
                    max="480"
                    step="15"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Estimated time needed (30 minutes to 8 hours)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide any additional information the helper should know"
                    className="min-h-[120px]"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-muted p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">
              Personalized Support Options
            </h3>

            <FormField
              control={form.control}
              name="includeUserPreferences"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Include Profile Preferences</FormLabel>
                    <FormDescription>
                      Automatically include your saved preferences and needs
                      from your profile
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specificNeeds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Needs for This Request</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Mobility assistance",
                      "Medication reminders",
                      "Meal preparation",
                      "Transportation",
                      "Companionship",
                      "Light housekeeping",
                      "Technology help",
                      "Reading assistance",
                    ].map((need) => (
                      <div key={need} className="flex items-center space-x-2">
                        <Checkbox
                          id={`need-${need}`}
                          checked={field.value?.includes(need)}
                          onCheckedChange={(checked) => {
                            const updatedNeeds = checked
                              ? [...(field.value || []), need]
                              : (field.value || []).filter(
                                  (value) => value !== need,
                                );
                            field.onChange(updatedNeeds);
                          }}
                          disabled={isLoading}
                        />
                        <label
                          htmlFor={`need-${need}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {need}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caregiverNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <span>Caregiver Notes for Helper</span>
                      <div className="rounded-full bg-primary/10 p-1">
                        <InfoIcon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </FormLabel>
                  <FormDescription>
                    These notes will only be visible to the assigned helper
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Special instructions, tips for interaction, or other notes that would help the helper provide better service"
                      className="min-h-[120px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ServiceRequestForm;
