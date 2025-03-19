import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions: string;
  isImportant: boolean;
  refillReminder: boolean;
  refillDate?: string;
}

interface AddMedicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MedicationFormData) => void;
}

const AddMedicationForm = ({
  open,
  onOpenChange,
  onSubmit,
}: AddMedicationFormProps) => {
  const [formData, setFormData] = useState<MedicationFormData>({
    name: "",
    dosage: "",
    frequency: "daily",
    time: "08:00",
    instructions: "",
    isImportant: false,
    refillReminder: false,
    refillDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Medication name is required";
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = "Dosage is required";
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    if (formData.refillReminder && !formData.refillDate) {
      newErrors.refillDate = "Refill date is required when reminder is enabled";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      dosage: "",
      frequency: "daily",
      time: "08:00",
      instructions: "",
      isImportant: false,
      refillReminder: false,
      refillDate: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Enter the details of your medication and set up reminders.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Medication Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Lisinopril"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              placeholder="e.g., 10mg, 1 tablet"
            />
            {errors.dosage && (
              <p className="text-sm text-red-500">{errors.dosage}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) =>
                  handleSelectChange("frequency", value)
                }
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="twice-daily">Twice Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="as-needed">As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
              />
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="e.g., Take with food, avoid alcohol"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isImportant"
              checked={formData.isImportant}
              onCheckedChange={(checked) =>
                handleCheckboxChange("isImportant", checked as boolean)
              }
            />
            <Label htmlFor="isImportant" className="text-sm font-medium">
              Mark as important medication
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="refillReminder"
              checked={formData.refillReminder}
              onCheckedChange={(checked) =>
                handleCheckboxChange("refillReminder", checked as boolean)
              }
            />
            <Label htmlFor="refillReminder" className="text-sm font-medium">
              Set refill reminder
            </Label>
          </div>

          {formData.refillReminder && (
            <div className="grid gap-2 pl-6">
              <Label htmlFor="refillDate">Refill Date</Label>
              <Input
                id="refillDate"
                name="refillDate"
                type="date"
                value={formData.refillDate}
                onChange={handleInputChange}
              />
              {errors.refillDate && (
                <p className="text-sm text-red-500">{errors.refillDate}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Medication</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationForm;
