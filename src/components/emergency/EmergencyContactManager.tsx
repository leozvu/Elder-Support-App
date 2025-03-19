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
import { Plus, Trash2, Edit, Phone, User, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary?: boolean;
}

interface EmergencyContactManagerProps {
  contacts?: EmergencyContact[];
  onAddContact?: (contact: Omit<EmergencyContact, "id">) => void;
  onUpdateContact?: (contact: EmergencyContact) => void;
  onDeleteContact?: (id: string) => void;
  onSetPrimary?: (id: string) => void;
  maxContacts?: number;
}

const EmergencyContactManager = ({
  contacts: initialContacts = [
    {
      id: "1",
      name: "John Smith",
      phone: "(555) 123-4567",
      relationship: "Son",
      isPrimary: true,
    },
    {
      id: "2",
      name: "Community Hub",
      phone: "(555) 987-6543",
      relationship: "Care Provider",
      isPrimary: false,
    },
    {
      id: "3",
      name: "Emergency Services",
      phone: "911",
      relationship: "Emergency",
      isPrimary: false,
    },
  ],
  onAddContact = () => {},
  onUpdateContact = () => {},
  onDeleteContact = () => {},
  onSetPrimary = () => {},
  maxContacts = 5,
}: EmergencyContactManagerProps) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<EmergencyContact | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const errors = {
      name: "",
      phone: "",
      relationship: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      valid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      valid = false;
    } else if (!/^[\d\(\)\-\+\s]+$/.test(formData.phone)) {
      errors.phone = "Invalid phone number format";
      valid = false;
    }

    if (!formData.relationship.trim()) {
      errors.relationship = "Relationship is required";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleAddContact = () => {
    if (!validateForm()) return;

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      relationship: formData.relationship,
      isPrimary: contacts.length === 0, // Make primary if it's the first contact
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    onAddContact({
      name: formData.name,
      phone: formData.phone,
      relationship: formData.relationship,
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditContact = () => {
    if (!validateForm() || !currentContact) return;

    const updatedContacts = contacts.map((contact) =>
      contact.id === currentContact.id
        ? {
            ...contact,
            name: formData.name,
            phone: formData.phone,
            relationship: formData.relationship,
          }
        : contact,
    );

    setContacts(updatedContacts);
    onUpdateContact({
      ...currentContact,
      name: formData.name,
      phone: formData.phone,
      relationship: formData.relationship,
    });
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteContact = (id: string) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    onDeleteContact(id);
  };

  const handleSetPrimary = (id: string) => {
    const updatedContacts = contacts.map((contact) => ({
      ...contact,
      isPrimary: contact.id === id,
    }));
    setContacts(updatedContacts);
    onSetPrimary(id);
  };

  const openEditDialog = (contact: EmergencyContact) => {
    setCurrentContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      relationship: "",
    });
    setFormErrors({
      name: "",
      phone: "",
      relationship: "",
    });
    setCurrentContact(null);
  };

  const getRelationshipIcon = (relationship: string) => {
    const lowerRelationship = relationship.toLowerCase();
    if (lowerRelationship.includes("emergency"))
      return <Phone className="h-4 w-4 text-red-500" />;
    if (
      lowerRelationship.includes("provider") ||
      lowerRelationship.includes("hub")
    )
      return <Heart className="h-4 w-4 text-blue-500" />;
    return <User className="h-4 w-4 text-green-500" />;
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Emergency Contacts</CardTitle>
        <CardDescription>
          These people will be contacted in case of emergency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No emergency contacts added yet
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getRelationshipIcon(contact.relationship)}
                  </div>
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {contact.phone}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {contact.relationship}
                      </Badge>
                      {contact.isPrimary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!contact.isPrimary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(contact.id)}
                      aria-label={`Set ${contact.name} as primary contact`}
                    >
                      Set Primary
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(contact)}
                    aria-label={`Edit ${contact.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteContact(contact.id)}
                    aria-label={`Delete ${contact.name}`}
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
            <Button
              className="w-full"
              disabled={contacts.length >= maxContacts}
              onClick={() => resetForm()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Emergency Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>
                Add someone who should be contacted in case of emergency
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  placeholder="Son, Daughter, Neighbor, etc."
                />
                {formErrors.relationship && (
                  <p className="text-sm text-red-500">
                    {formErrors.relationship}
                  </p>
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
              <Button onClick={handleAddContact}>Add Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Emergency Contact</DialogTitle>
              <DialogDescription>
                Update the information for this emergency contact
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
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
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-relationship">Relationship</Label>
                <Input
                  id="edit-relationship"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                />
                {formErrors.relationship && (
                  <p className="text-sm text-red-500">
                    {formErrors.relationship}
                  </p>
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
              <Button onClick={handleEditContact}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default EmergencyContactManager;
