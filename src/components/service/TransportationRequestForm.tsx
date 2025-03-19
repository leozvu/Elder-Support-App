import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Car, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TransportationRequestFormProps {
  onSubmit: (data: TransportationRequestData) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

export interface TransportationRequestData {
  pickupAddress: string;
  pickupDate: Date;
  pickupTime: string;
  destinationAddress: string;
  returnRide: boolean;
  returnTime?: string;
  specialNeeds: string;
  transportationType: "standard" | "wheelchair" | "assisted";
  additionalNotes: string;
  isRecurring?: boolean;
  recurringFrequency?: "daily" | "weekly" | "biweekly" | "monthly";
  preferredHelper?: string;
}

const TransportationRequestForm = ({
  onSubmit,
  onBack,
  isSubmitting = false,
}: TransportationRequestFormProps) => {
  const [formData, setFormData] = useState<TransportationRequestData>({
    pickupAddress: "",
    pickupDate: new Date(),
    pickupTime: "",
    destinationAddress: "",
    returnRide: false,
    returnTime: "",
    specialNeeds: "",
    transportationType: "standard",
    additionalNotes: "",
    isRecurring: false,
    recurringFrequency: "weekly",
    preferredHelper: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TransportationRequestData, string>>
  >({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name as keyof TransportationRequestData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    // If return ride is unchecked, clear return time error
    if (name === "returnRide" && !checked) {
      setErrors((prev) => ({ ...prev, returnTime: undefined }));
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, transportationType: value as any }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, pickupDate: date }));
      setErrors((prev) => ({ ...prev, pickupDate: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransportationRequestData, string>> =
      {};

    // Required fields validation
    if (!formData.pickupAddress.trim()) {
      newErrors.pickupAddress = "Pickup address is required";
    }

    if (!formData.pickupTime) {
      newErrors.pickupTime = "Pickup time is required";
    }

    if (!formData.destinationAddress.trim()) {
      newErrors.destinationAddress = "Destination address is required";
    }

    // Return time validation if return ride is checked
    if (formData.returnRide && !formData.returnTime) {
      newErrors.returnTime = "Return time is required for return rides";
    }

    // Date validation - ensure it's not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickupDate = new Date(formData.pickupDate);
    pickupDate.setHours(0, 0, 0, 0);

    if (pickupDate < today) {
      newErrors.pickupDate = "Pickup date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Transportation Request</h2>
        <p className="text-muted-foreground">
          Please provide the details for your transportation needs
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="pickupAddress"
            className={errors.pickupAddress ? "text-destructive" : ""}
          >
            Pickup Address{" "}
            {errors.pickupAddress && (
              <span className="text-destructive">*</span>
            )}
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="pickupAddress"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleInputChange}
              placeholder="Enter your pickup address"
              className={cn(
                "pl-10",
                errors.pickupAddress && "border-destructive",
              )}
              aria-invalid={!!errors.pickupAddress}
              required
            />
          </div>
          {errors.pickupAddress && (
            <p className="text-sm text-destructive">{errors.pickupAddress}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className={errors.pickupDate ? "text-destructive" : ""}>
              Pickup Date{" "}
              {errors.pickupDate && <span className="text-destructive">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="pickupDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.pickupDate && "text-muted-foreground",
                    errors.pickupDate && "border-destructive",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.pickupDate ? (
                    format(formData.pickupDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.pickupDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.pickupDate && (
              <p className="text-sm text-destructive">{errors.pickupDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="pickupTime"
              className={errors.pickupTime ? "text-destructive" : ""}
            >
              Pickup Time{" "}
              {errors.pickupTime && <span className="text-destructive">*</span>}
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="pickupTime"
                name="pickupTime"
                type="time"
                value={formData.pickupTime}
                onChange={handleInputChange}
                className={cn(
                  "pl-10",
                  errors.pickupTime && "border-destructive",
                )}
                aria-invalid={!!errors.pickupTime}
                required
              />
            </div>
            {errors.pickupTime && (
              <p className="text-sm text-destructive">{errors.pickupTime}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="destinationAddress"
            className={errors.destinationAddress ? "text-destructive" : ""}
          >
            Destination Address{" "}
            {errors.destinationAddress && (
              <span className="text-destructive">*</span>
            )}
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="destinationAddress"
              name="destinationAddress"
              value={formData.destinationAddress}
              onChange={handleInputChange}
              placeholder="Enter your destination address"
              className={cn(
                "pl-10",
                errors.destinationAddress && "border-destructive",
              )}
              aria-invalid={!!errors.destinationAddress}
              required
            />
          </div>
          {errors.destinationAddress && (
            <p className="text-sm text-destructive">
              {errors.destinationAddress}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="returnRide"
            checked={formData.returnRide}
            onCheckedChange={(checked) => {
              setFormData((prev) => ({
                ...prev,
                returnRide: checked === true,
              }));
              if (!checked) {
                setErrors((prev) => ({ ...prev, returnTime: undefined }));
              }
            }}
          />
          <Label htmlFor="returnRide" className="text-sm font-medium">
            I need a return ride
          </Label>
        </div>

        {formData.returnRide && (
          <div className="space-y-2 pl-6">
            <Label
              htmlFor="returnTime"
              className={errors.returnTime ? "text-destructive" : ""}
            >
              Return Pickup Time{" "}
              {errors.returnTime && <span className="text-destructive">*</span>}
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="returnTime"
                name="returnTime"
                type="time"
                value={formData.returnTime}
                onChange={handleInputChange}
                className={cn(
                  "pl-10",
                  errors.returnTime && "border-destructive",
                )}
                aria-invalid={!!errors.returnTime}
                required
              />
            </div>
            {errors.returnTime && (
              <p className="text-sm text-destructive">{errors.returnTime}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label>Transportation Type</Label>
          <RadioGroup
            value={formData.transportationType}
            onValueChange={handleRadioChange}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="flex items-center">
                <Car className="mr-2 h-4 w-4" />
                Standard
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
              <RadioGroupItem value="wheelchair" id="wheelchair" />
              <Label htmlFor="wheelchair" className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12H19M19 12L16 15M19 12L16 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="9"
                    cy="7"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M9 14V11C9 9.89543 9.89543 9 11 9H13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="9"
                    cy="17"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Wheelchair
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
              <RadioGroupItem value="assisted" id="assisted" />
              <Label htmlFor="assisted" className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 6H17.5C18.8807 6 20 7.11929 20 8.5C20 9.88071 18.8807 11 17.5 11H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 16H6.5C5.11929 16 4 14.8807 4 13.5C4 12.1193 5.11929 11 6.5 11H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 3C10.3431 3 9 4.34315 9 6C9 7.65685 10.3431 9 12 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 15C10.3431 15 9 16.3431 9 18C9 19.6569 10.3431 21 12 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Assisted
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialNeeds">Special Needs or Requirements</Label>
          <Textarea
            id="specialNeeds"
            name="specialNeeds"
            value={formData.specialNeeds}
            onChange={handleInputChange}
            placeholder="Please describe any special needs or requirements"
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            placeholder="Any additional information that might help the driver"
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <Checkbox
              id="isRecurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  isRecurring: checked === true,
                }));
              }}
            />
            <Label htmlFor="isRecurring" className="text-sm font-medium">
              Make this a recurring service
            </Label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="recurringFrequency">Recurring Frequency</Label>
              <RadioGroup
                value={formData.recurringFrequency}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    recurringFrequency: value as any,
                  }))
                }
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                  <RadioGroupItem value="biweekly" id="biweekly" />
                  <Label htmlFor="biweekly">Bi-weekly</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="preferredHelper">Preferred Helper (Optional)</Label>
            <Select
              value={formData.preferredHelper}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, preferredHelper: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a preferred helper" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No preference</SelectItem>
                <SelectItem value="helper-123">Sarah Johnson</SelectItem>
                <SelectItem value="helper-456">Michael Chen</SelectItem>
                <SelectItem value="helper-789">David Wilson</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              If you've had a positive experience with a helper, you can request
              them again.
            </p>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <CalendarIcon className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              Please schedule transportation requests at least 24 hours in
              advance when possible. For urgent transportation needs, we'll do
              our best to accommodate but cannot guarantee availability.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
        )}
        <Button type="submit" className="ml-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </Button>
      </div>
    </form>
  );
};

export default TransportationRequestForm;
