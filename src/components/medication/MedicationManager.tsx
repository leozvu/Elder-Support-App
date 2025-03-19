import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Edit, Clock, Pill, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  refillReminder?: boolean;
  refillDate?: string;
}

interface MedicationManagerProps {
  medications?: Medication[];
  onAddMedication?: (medication: Omit<Medication, "id">) => void;
  onUpdateMedication?: (medication: Medication) => void;
  onDeleteMedication?: (id: string) => void;
}

const MedicationManager = ({
  medications: initialMedications = [
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timeOfDay: "Morning",
      startDate: "2023-01-15",
      notes: "Take with food",
      refillReminder: true,
      refillDate: "2023-06-15",
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      timeOfDay: "Morning and Evening",
      startDate: "2023-02-10",
      notes: "Take with meals",
      refillReminder: true,
      refillDate: "2023-06-10",
    },
    {
      id: "3",
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      timeOfDay: "Morning",
      startDate: "2023-03-01",
      refillReminder: false,
    },
  ],
  onAddMedication = () => {},
  onUpdateMedication = () => {},
  onDeleteMedication = () => {},
}: MedicationManagerProps) => {
  const [medications, setMedications] =
    useState<Medication[]>(initialMedications);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    timeOfDay: "",
    startDate: "",
    endDate: "",
    notes: "",
    refillReminder: false,
    refillDate: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    dosage: "",
    frequency: "",
    timeOfDay: "",
    startDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    let valid = true;
    const errors = {
      name: "",
      dosage: "",
      frequency: "",
      timeOfDay: "",
      startDate: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Medication name is required";
      valid = false;
    }

    if (!formData.dosage.trim()) {
      errors.dosage = "Dosage is required";
      valid = false;
    }

    if (!formData.frequency.trim()) {
      errors.frequency = "Frequency is required";
      valid = false;
    }

    if (!formData.timeOfDay.trim()) {
      errors.timeOfDay = "Time of day is required";
      valid = false;
    }

    if (!formData.startDate.trim()) {
      errors.startDate = "Start date is required";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleAddMedication = () => {
    if (!validateForm()) return;

    const newMedication: Medication = {
      id: Date.now().toString(),
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      timeOfDay: formData.timeOfDay,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      notes: formData.notes || undefined,
      refillReminder: formData.refillReminder,
      refillDate: formData.refillReminder ? formData.refillDate : undefined,
    };

    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    onAddMedication({
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      timeOfDay: formData.timeOfDay,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      notes: formData.notes || undefined,
      refillReminder: formData.refillReminder,
      refillDate: formData.refillReminder ? formData.refillDate : undefined,
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditMedication = () => {
    if (!validateForm() || !currentMedication) return;

    const updatedMedications = medications.map((medication) =>
      medication.id === currentMedication.id
        ? {
            ...medication,
            name: formData.name,
            dosage: formData.dosage,
            frequency: formData.frequency,
            timeOfDay: formData.timeOfDay,
            startDate: formData.startDate,
            endDate: formData.endDate || undefined,
            notes: formData.notes || undefined,
            refillReminder: formData.refillReminder,
            refillDate: formData.refillReminder
              ? formData.refillDate
              : undefined,
          }
        : medication,
    );

    setMedications(updatedMedications);
    onUpdateMedication({
      ...currentMedication,
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      timeOfDay: formData.timeOfDay,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      notes: formData.notes || undefined,
      refillReminder: formData.refillReminder,
      refillDate: formData.refillReminder ? formData.refillDate : undefined,
    });
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteMedication = (id: string) => {
    const updatedMedications = medications.filter(
      (medication) => medication.id !== id,
    );
    setMedications(updatedMedications);
    onDeleteMedication(id);
  };

  const openEditDialog = (medication: Medication) => {
    setCurrentMedication(medication);
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      timeOfDay: medication.timeOfDay,
      startDate: medication.startDate,
      endDate: medication.endDate || "",
      notes: medication.notes || "",
      refillReminder: medication.refillReminder || false,
      refillDate: medication.refillDate || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      dosage: "",
      frequency: "",
      timeOfDay: "",
      startDate: "",
      endDate: "",
      notes: "",
      refillReminder: false,
      refillDate: "",
    });
    setFormErrors({
      name: "",
      dosage: "",
      frequency: "",
      timeOfDay: "",
      startDate: "",
    });
    setCurrentMedication(null);
  };

  const getFrequencyIcon = (frequency: string) => {
    if (frequency.toLowerCase().includes("daily")) {
      return <Calendar className="h-4 w-4 text-blue-500" />;
    }
    return <Clock className="h-4 w-4 text-green-500" />;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const isRefillSoon = (refillDate?: string) => {
    if (!refillDate) return false;

    const today = new Date();
    const refill = new Date(refillDate);
    const diffTime = refill.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Medication Management
        </CardTitle>
        <CardDescription>
          Track your medications and set reminders for refills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medications.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No medications added yet
            </div>
          ) : (
            medications.map((medication) => (
              <div
                key={medication.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Pill className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{medication.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {medication.dosage}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        {getFrequencyIcon(medication.frequency)}
                        {medication.frequency} ({medication.timeOfDay})
                      </span>
                      {medication.refillReminder && medication.refillDate && (
                        <Badge
                          variant={
                            isRefillSoon(medication.refillDate)
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          Refill: {formatDate(medication.refillDate)}
                        </Badge>
                      )}
                    </div>
                    {medication.notes && (
                      <p className="text-xs text-gray-500 mt-1">
                        {medication.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(medication)}
                    aria-label={`Edit ${medication.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMedication(medication.id)}
                    aria-label={`Delete ${medication.name}`}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Medication</DialogTitle>
              <DialogDescription>
                Add details about your medication and set reminders
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Lisinopril"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  placeholder="10mg"
                />
                {formErrors.dosage && (
                  <p className="text-sm text-red-500">{formErrors.dosage}</p>
                )}
              </div>

              <div className="space-y-2">
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
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">
                      Three times daily
                    </SelectItem>
                    <SelectItem value="Every other day">
                      Every other day
                    </SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.frequency && (
                  <p className="text-sm text-red-500">{formErrors.frequency}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeOfDay">Time of Day</Label>
                <Select
                  value={formData.timeOfDay}
                  onValueChange={(value) =>
                    handleSelectChange("timeOfDay", value)
                  }
                >
                  <SelectTrigger id="timeOfDay">
                    <SelectValue placeholder="Select time of day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Bedtime">Bedtime</SelectItem>
                    <SelectItem value="Morning and Evening">
                      Morning and Evening
                    </SelectItem>
                    <SelectItem value="With meals">With meals</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.timeOfDay && (
                  <p className="text-sm text-red-500">{formErrors.timeOfDay}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                  {formErrors.startDate && (
                    <p className="text-sm text-red-500">
                      {formErrors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Take with food, etc."
                />
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="refillReminder"
                    name="refillReminder"
                    checked={formData.refillReminder}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="refillReminder"
                    className="text-sm font-medium"
                  >
                    Set refill reminder
                  </Label>
                </div>

                {formData.refillReminder && (
                  <div className="pt-2">
                    <Label htmlFor="refillDate">Refill Date</Label>
                    <Input
                      id="refillDate"
                      name="refillDate"
                      type="date"
                      value={formData.refillDate}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddMedication}>Add Medication</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Medication</DialogTitle>
              <DialogDescription>
                Update the details for this medication
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Medication Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dosage">Dosage</Label>
                <Input
                  id="edit-dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                />
                {formErrors.dosage && (
                  <p className="text-sm text-red-500">{formErrors.dosage}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) =>
                    handleSelectChange("frequency", value)
                  }
                >
                  <SelectTrigger id="edit-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">
                      Three times daily
                    </SelectItem>
                    <SelectItem value="Every other day">
                      Every other day
                    </SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.frequency && (
                  <p className="text-sm text-red-500">{formErrors.frequency}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-timeOfDay">Time of Day</Label>
                <Select
                  value={formData.timeOfDay}
                  onValueChange={(value) =>
                    handleSelectChange("timeOfDay", value)
                  }
                >
                  <SelectTrigger id="edit-timeOfDay">
                    <SelectValue placeholder="Select time of day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Bedtime">Bedtime</SelectItem>
                    <SelectItem value="Morning and Evening">
                      Morning and Evening
                    </SelectItem>
                    <SelectItem value="With meals">With meals</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.timeOfDay && (
                  <p className="text-sm text-red-500">{formErrors.timeOfDay}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                  {formErrors.startDate && (
                    <p className="text-sm text-red-500">
                      {formErrors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date (Optional)</Label>
                  <Input
                    id="edit-endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Input
                  id="edit-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-refillReminder"
                    name="refillReminder"
                    checked={formData.refillReminder}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="edit-refillReminder"
                    className="text-sm font-medium"
                  >
                    Set refill reminder
                  </Label>
                </div>

                {formData.refillReminder && (
                  <div className="pt-2">
                    <Label htmlFor="edit-refillDate">Refill Date</Label>
                    <Input
                      id="edit-refillDate"
                      name="refillDate"
                      type="date"
                      value={formData.refillDate}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditMedication}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default MedicationManager;
