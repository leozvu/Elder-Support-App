import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import EmergencyDashboard from "@/components/emergency/EmergencyDashboard";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary?: boolean;
}

const EmergencyServices = () => {
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([
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
  ]);

  const handleAddContact = (contact: Omit<EmergencyContact, "id">) => {
    // If this is set as primary, update other contacts
    let updatedContacts = [...emergencyContacts];
    if (contact.isPrimary) {
      updatedContacts = updatedContacts.map((c) => ({
        ...c,
        isPrimary: false,
      }));
    }

    // Add the new contact
    setEmergencyContacts([
      ...updatedContacts,
      {
        ...contact,
        id: `contact-${Date.now()}`,
      },
    ]);
  };

  const handleUpdateContact = (updatedContact: EmergencyContact) => {
    // If this is set as primary, update other contacts
    let newContacts = [...emergencyContacts];
    if (updatedContact.isPrimary) {
      newContacts = newContacts.map((contact) => ({
        ...contact,
        isPrimary: contact.id === updatedContact.id ? true : false,
      }));
    } else {
      newContacts = newContacts.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact,
      );
    }

    setEmergencyContacts(newContacts);
  };

  const handleDeleteContact = (id: string) => {
    setEmergencyContacts(
      emergencyContacts.filter((contact) => contact.id !== id),
    );
  };

  const handleActivateSOS = () => {
    console.log("SOS Activated");
    // In a real app, this would trigger emergency protocols
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <EmergencyDashboard
          emergencyContacts={emergencyContacts}
          onAddContact={handleAddContact}
          onUpdateContact={handleUpdateContact}
          onDeleteContact={handleDeleteContact}
          onActivateSOS={handleActivateSOS}
        />
      </div>
    </Layout>
  );
};

export default EmergencyServices;
