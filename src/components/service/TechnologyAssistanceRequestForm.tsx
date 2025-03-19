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
import { CalendarIcon, Clock, Smartphone, Laptop, Wifi } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TechnologyAssistanceRequestFormProps {
  onSubmit: (data: TechnologyAssistanceRequestData) => void;
  onBack?: () => void;
}

export interface TechnologyAssistanceRequestData {
  deviceType: string;
  issueType: string;
  appointmentDate: Date;
  preferredTimeSlot: string;
  description: string;
  isUrgent: boolean;
  hasAttemptedFix: boolean;
  additionalNotes: string;
  contactPhone: string;
}

const deviceTypes = [
  { id: "smartphone", label: "Smartphone" },
  { id: "tablet", label: "Tablet" },
  { id: "laptop", label: "Laptop/Computer" },
  { id: "tv", label: "TV/Smart TV" },
  { id: "printer", label: "Printer" },
  { id: "other", label: "Other" },
];

const issueTypes = [
  { id: "setup", label: "Device Setup" },
  { id: "wifi", label: "WiFi/Internet" },
  { id: "email", label: "Email Setup/Issues" },
  { id: "apps", label: "App Installation/Usage" },
  { id: "videocalls", label: "Video Calls" },
  { id: "photos", label: "Photos/Media" },
  { id: "other", label: "Other" },
];

const timeSlots = [
  { id: "morning", label: "Morning (8AM - 12PM)" },
  { id: "afternoon", label: "Afternoon (12PM - 4PM)" },
  { id: "evening", label: "Evening (4PM - 8PM)" },
];

const TechnologyAssistanceRequestForm = ({
  onSubmit,
  onBack,
}: TechnologyAssistanceRequestFormProps) => {
  const [formData, setFormData] = useState<TechnologyAssistanceRequestData>({
    deviceType: "",
    issueType: "",
    appointmentDate: new Date(),
    preferredTimeSlot: "",
    description: "",
    isUrgent: false,
    hasAttemptedFix: false,
    additionalNotes: "",
    contactPhone: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, appointmentDate: date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Technology Assistance Request</h2>
        <p className="text-muted-foreground">
          Please provide the details for your technology assistance needs
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Device Type</Label>
          <RadioGroup
            value={formData.deviceType}
            onValueChange={(value) => handleRadioChange("deviceType", value)}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2"
          >
            {deviceTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id} id={`device-${type.id}`} />
                <Label htmlFor={`device-${type.id}`}>{type.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Issue Type</Label>
          <RadioGroup
            value={formData.issueType}
            onValueChange={(value) => handleRadioChange("issueType", value)}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2"
          >
            {issueTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id} id={`issue-${type.id}`} />
                <Label htmlFor={`issue-${type.id}`}>{type.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Appointment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.appointmentDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.appointmentDate ? (
                    format(formData.appointmentDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.appointmentDate}
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
                  <RadioGroupItem value={slot.id} id={`time-${slot.id}`} />
                  <Label htmlFor={`time-${slot.id}`}>{slot.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description of Issue</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Please describe the technology issue you're experiencing in detail"
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="flex flex-col space-y-2 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isUrgent"
              checked={formData.isUrgent}
              onCheckedChange={(checked) =>
                handleCheckboxChange("isUrgent", checked as boolean)
              }
            />
            <Label htmlFor="isUrgent" className="text-sm font-medium">
              This is urgent (I need help as soon as possible)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasAttemptedFix"
              checked={formData.hasAttemptedFix}
              onCheckedChange={(checked) =>
                handleCheckboxChange("hasAttemptedFix", checked as boolean)
              }
            />
            <Label htmlFor="hasAttemptedFix" className="text-sm font-medium">
              I have already attempted to fix this issue
            </Label>
          </div>
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
            placeholder="Any additional information that might help the tech assistant"
            className="min-h-[80px]"
          />
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

export default TechnologyAssistanceRequestForm;
