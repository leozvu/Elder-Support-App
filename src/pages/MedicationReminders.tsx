import React from "react";
import Layout from "@/components/layout/Layout";
import MedicationReminderSystem from "@/components/medication/MedicationReminderSystem";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";

const MedicationReminders = () => {
  const navigate = useNavigate();
  const { speak } = useVoiceGuidance();

  const handleBack = () => {
    speak("Going back to dashboard", true);
    navigate(-1);
  };

  const handleAddMedication = () => {
    speak("Opening add medication form", true);
    // This would typically open a modal or navigate to an add form
    // For now, we'll just announce it
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Medication Reminders</h1>
          </div>
          <Button onClick={handleAddMedication} aria-label="Add new medication">
            <Plus className="h-5 w-5 mr-2" /> Add Medication
          </Button>
        </div>

        <MedicationReminderSystem />
      </div>
    </Layout>
  );
};

export default MedicationReminders;
