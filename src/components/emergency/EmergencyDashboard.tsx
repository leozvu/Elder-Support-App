import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Phone,
  MapPin,
  User,
  Clock,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import EmergencySOSButton from "./EmergencySOSButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary?: boolean;
}

interface EmergencyDashboardProps {
  emergencyContacts?: EmergencyContact[];
  onAddContact?: (contact: Omit<EmergencyContact, "id">) => void;
  onUpdateContact?: (contact: EmergencyContact) => void;
  onDeleteContact?: (id: string) => void;
  onActivateSOS?: () => void;
  className?: string;
}

const EmergencyDashboard = ({
  emergencyContacts = [
    {
      id: "1",
      name: "John Smith",
      relationship: "Son",
      phone: "(555) 123-4567",
      isPrimary: true,
    },
    {
      id: "2",
      name: "Mary Johnson",
      relationship: "Daughter",
      phone: "(555) 987-6543",
      isPrimary: false,
    },
    {
      id: "3",
      name: "Dr. Williams",
      relationship: "Primary Physician",
      phone: "(555) 456-7890",
      isPrimary: false,
    },
  ],
  onAddContact = () => {},
  onUpdateContact = () => {},
  onDeleteContact = () => {},
  onActivateSOS = () => {},
  className = "",
}: EmergencyDashboardProps) => {
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isEditContactDialogOpen, setIsEditContactDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    isPrimary: false,
  });
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(
    null,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing = false,
  ) => {
    const { name, value, type, checked } = e.target;
    if (isEditing && editingContact) {
      setEditingContact({
        ...editingContact,
        [name]: type === "checkbox" ? checked : value,
      });
    } else {
      setNewContact({
        ...newContact,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleAddContact = () => {
    onAddContact(newContact);
    setNewContact({
      name: "",
      relationship: "",
      phone: "",
      isPrimary: false,
    });
    setIsAddContactDialogOpen(false);
  };

  const handleUpdateContact = () => {
    if (editingContact) {
      onUpdateContact(editingContact);
      setEditingContact(null);
      setIsEditContactDialogOpen(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    onDeleteContact(id);
  };

  const startEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setIsEditContactDialogOpen(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Emergency Services</h2>
          <p className="text-muted-foreground">
            Manage your emergency contacts and access emergency services
          </p>
        </div>
        <EmergencySOSButton
          onActivate={onActivateSOS}
          emergencyContacts={emergencyContacts}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>
                People to contact in case of emergency
              </CardDescription>
              <Button
                variant="link"
                className="text-sm p-0 h-auto"
                onClick={() => (window.location.href = "/emergency-contacts")}
              >
                Manage all contacts
              </Button>
            </div>
            <Dialog
              open={isAddContactDialogOpen}
              onOpenChange={setIsAddContactDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>
                    Add a new emergency contact who will be notified in case of
                    emergency
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newContact.name}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      name="relationship"
                      value={newContact.relationship}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="Son, Daughter, Doctor, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newContact.phone}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      name="isPrimary"
                      checked={newContact.isPrimary}
                      onChange={(e) => handleInputChange(e)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isPrimary" className="text-sm font-medium">
                      Set as primary contact
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddContactDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddContact}>Add Contact</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {emergencyContacts.length === 0 ? (
              <div className="text-center py-6">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium">No contacts added</h3>
                <p className="text-muted-foreground mb-4">
                  Add emergency contacts to be notified in case of emergency
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsAddContactDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Contact
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {emergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="mb-3 sm:mb-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{contact.name}</h3>
                        {contact.isPrimary && (
                          <Badge variant="outline" className="text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {contact.relationship}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" /> {contact.phone}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditContact(contact)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Resources</CardTitle>
            <CardDescription>
              Important emergency information and resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Emergency Services
              </h3>
              <p className="text-red-700 text-lg font-bold mt-1">911</p>
              <p className="text-sm text-red-600 mt-1">
                Call for immediate emergency assistance
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Local Resources</h3>
              <div className="flex items-start gap-3 border-b pb-3">
                <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Poison Control</p>
                  <p className="text-sm text-muted-foreground">
                    (800) 222-1222
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-b pb-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Nearest Hospital</p>
                  <p className="text-sm text-muted-foreground">
                    Memorial Hospital - 2.3 miles
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">24/7 Nurse Hotline</p>
                  <p className="text-sm text-muted-foreground">
                    (555) 789-0123
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Emergency Plan
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog
        open={isEditContactDialogOpen}
        onOpenChange={setIsEditContactDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Emergency Contact</DialogTitle>
            <DialogDescription>
              Update the information for this emergency contact
            </DialogDescription>
          </DialogHeader>
          {editingContact && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingContact.name}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-relationship">Relationship</Label>
                <Input
                  id="edit-relationship"
                  name="relationship"
                  value={editingContact.relationship}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={editingContact.phone}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isPrimary"
                  name="isPrimary"
                  checked={editingContact.isPrimary}
                  onChange={(e) => handleInputChange(e, true)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-isPrimary" className="text-sm font-medium">
                  Set as primary contact
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditContactDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateContact}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyDashboard;
