import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Plus } from "lucide-react";

interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

interface EmergencyContactsSectionProps {
  contacts?: EmergencyContact[];
}

const EmergencyContactsSection = ({
  contacts = [
    { name: "Robert Johnson", relation: "Son", phone: "(555) 987-6543" },
    { name: "Sarah Williams", relation: "Daughter", phone: "(555) 456-7890" },
  ],
}: EmergencyContactsSectionProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Emergency Contacts
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-muted-foreground">
                  {contact.relation}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Phone className="h-3 w-3" />
                <span className="text-xs">{contact.phone}</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactsSection;
