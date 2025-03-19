import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface EmergencyContactFormProps {
  contact: {
    id?: string;
    name: string;
    relationship: string;
    phone: string;
    isPrimary: boolean;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (checked: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
  errors?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
}

const EmergencyContactForm = ({
  contact,
  onInputChange,
  onCheckboxChange,
  onSubmit,
  onCancel,
  isEditing = false,
  errors = {},
}: EmergencyContactFormProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={contact.name}
          onChange={onInputChange}
          placeholder="John Doe"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="relationship">Relationship</Label>
        <Input
          id="relationship"
          name="relationship"
          value={contact.relationship}
          onChange={onInputChange}
          placeholder="Son, Daughter, Doctor, etc."
        />
        {errors.relationship && (
          <p className="text-sm text-red-500">{errors.relationship}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          value={contact.phone}
          onChange={onInputChange}
          placeholder="(555) 123-4567"
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPrimary"
          checked={contact.isPrimary}
          onCheckedChange={onCheckboxChange}
        />
        <Label htmlFor="isPrimary" className="text-sm font-medium">
          Set as primary contact
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEditing ? "Save Changes" : "Add Contact"}
        </Button>
      </div>
    </div>
  );
};

export default EmergencyContactForm;
