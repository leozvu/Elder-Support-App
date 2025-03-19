import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Edit, Trash2, User } from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary?: boolean;
}

interface EmergencyContactListProps {
  contacts: EmergencyContact[];
  onEditContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;
  className?: string;
}

const EmergencyContactList = ({
  contacts,
  onEditContact,
  onDeleteContact,
  className = "",
}: EmergencyContactListProps) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>
          People to contact in case of emergency
        </CardDescription>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-6">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No contacts added</h3>
            <p className="text-muted-foreground mb-4">
              Add emergency contacts to be notified in case of emergency
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
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
                    onClick={() => onEditContact(contact)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteContact(contact.id)}
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
  );
};

export default EmergencyContactList;
