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
import { CalendarIcon, Clock, Wrench, Home } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HomeMaintenanceRequestFormProps {
  onSubmit: (data: HomeMaintenanceRequestData) => void;
  onBack?: () => void;
}

export interface HomeMaintenanceRequestData {
  serviceType: string;
  serviceDate: Date;
  preferredTimeSlot: string;
  description: string;
  urgency: "low" | "medium" | "high";
  hasSupplies: boolean;
  additionalNotes: string;
  contactPhone: string;
  isRecurring?: boolean;
  recurringFrequency?: "weekly" | "biweekly" | "monthly";
  preferredHelper?: string;
}

const serviceTypes = [
  { id: "cleaning", label: "Cleaning" },
  { id: "repairs", label: "Minor Repairs" },
  { id: "yardwork", label: "Yard Work" },
  { id: "organization", label: "Organization" },
  { id: "lightbulbs", label: "Light Bulb Replacement" },
  { id: "other", label: "Other" },
];

const timeSlots = [
  { id: "morning", label: "Morning (8AM - 12PM)" },
  { id: "afternoon", label: "Afternoon (12PM - 4PM)" },
  { id: "evening", label: "Evening (4PM - 8PM)" },
];

const HomeMaintenanceRequestForm = ({
  onSubmit,
  onBack,
}: HomeMaintenanceRequestFormProps) => {
  const [formData, setFormData] = useState<HomeMaintenanceRequestData>({
    serviceType: "",
    serviceDate: new Date(),
    preferredTimeSlot: "",
    description: "",
    urgency: "medium",
    hasSupplies: false,
    additionalNotes: "",
    contactPhone: "",
    isRecurring: false,
    recurringFrequency: "weekly",
    preferredHelper: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, hasSupplies: checked }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, serviceDate: date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Home Maintenance Request</h2>
        <p className="text-muted-foreground">
          Please provide the details for your home maintenance needs
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Service Type</Label>
          <RadioGroup
            value={formData.serviceType}
            onValueChange={(value) => handleRadioChange("serviceType", value)}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2"
          >
            {serviceTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id} id={type.id} />
                <Label htmlFor={type.id}>{type.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Service Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.serviceDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.serviceDate ? (
                    format(formData.serviceDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.serviceDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Preferred Time Slot</Label>
            <RadioGroup
              value={formData.preferredTimeSlot}
              onValueChange={(value) =>
                handleRadioChange("preferredTimeSlot", value)
              }
              className="space-y-2 pt-2"
            >
              {timeSlots.map((slot) => (
                <div key={slot.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={slot.id} id={slot.id} />
                  <Label htmlFor={slot.id}>{slot.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description of Work Needed</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Please describe the maintenance work you need help with"
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Urgency Level</Label>
          <RadioGroup
            value={formData.urgency}
            onValueChange={(value) =>
              handleRadioChange("urgency", value as any)
            }
            className="flex space-x-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low-urgency" />
              <Label htmlFor="low-urgency">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium-urgency" />
              <Label htmlFor="medium-urgency">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high-urgency" />
              <Label htmlFor="high-urgency">High</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="hasSupplies"
            checked={formData.hasSupplies}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="hasSupplies" className="text-sm font-medium">
            I have the necessary supplies/tools for this task
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact Phone Number</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            value={formData.contactPhone}
            onChange={handleInputChange}
            placeholder="(555) 123-4567"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            placeholder="Any additional information that might help the helper"
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
              <Label>Recurring Frequency</Label>
              <RadioGroup
                value={formData.recurringFrequency}
                onValueChange={(value) =>
                  handleRadioChange("recurringFrequency", value)
                }
                className="grid grid-cols-3 gap-4 pt-2"
              >
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
              <SelectTrigger id="preferredHelper">
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
        </div>
      </div>

      <div className="flex justify-between pt-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button type="submit" className="ml-auto">
          Submit Request
        </Button>
      </div>
    </form>
  );
};

export default HomeMaintenanceRequestForm;
