import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Check,
  Plus,
  Trash2,
  Clock,
  Save,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

interface ServiceChecklistProps {
  serviceId: string;
  serviceType: string;
  isHelper?: boolean;
  isCompleted?: boolean;
  onComplete?: () => void;
  className?: string;
}

const ServiceChecklist: React.FC<ServiceChecklistProps> = ({
  serviceId,
  serviceType,
  isHelper = true,
  isCompleted = false,
  onComplete,
  className,
}) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load checklist items based on service type
  useEffect(() => {
    const loadChecklist = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // First try to load existing checklist for this service
        const { data: existingData, error: existingError } = await supabase
          .from("service_checklists")
          .select("*")
          .eq("service_request_id", serviceId)
          .single();

        if (existingError && existingError.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error, which is expected if no checklist exists
          console.error("Error loading existing checklist:", existingError);
          throw existingError;
        }

        if (existingData) {
          // Parse the items from JSON
          setItems(existingData.items || []);
          setNotes(existingData.notes || "");
          return;
        }

        // If no existing checklist, load template based on service type
        const { data: templateData, error: templateError } = await supabase
          .from("checklist_templates")
          .select("*")
          .eq("service_type", serviceType)
          .single();

        if (templateError && templateError.code !== "PGRST116") {
          console.error("Error loading template:", templateError);
          throw templateError;
        }

        if (templateData) {
          // Create items from template
          const templateItems: ChecklistItem[] = templateData.items.map(
            (item: string, index: number) => ({
              id: `template-${index}`,
              text: item,
              completed: false,
            }),
          );
          setItems(templateItems);

          // Create a new checklist record
          const { error: createError } = await supabase
            .from("service_checklists")
            .insert({
              service_request_id: serviceId,
              items: templateItems,
              status: "in_progress",
            });

          if (createError) {
            console.error("Error creating checklist:", createError);
            throw createError;
          }
        } else {
          // If no template exists, create some default items based on service type
          let defaultItems: ChecklistItem[] = [];

          if (serviceType.includes("transport")) {
            defaultItems = [
              {
                id: "default-1",
                text: "Arrive at pickup location",
                completed: false,
              },
              {
                id: "default-2",
                text: "Assist with entry/exit from vehicle",
                completed: false,
              },
              {
                id: "default-3",
                text: "Secure any mobility aids",
                completed: false,
              },
              {
                id: "default-4",
                text: "Arrive at destination",
                completed: false,
              },
              {
                id: "default-5",
                text: "Confirm next steps with senior",
                completed: false,
              },
            ];
          } else if (serviceType.includes("shopping")) {
            defaultItems = [
              {
                id: "default-1",
                text: "Review shopping list",
                completed: false,
              },
              {
                id: "default-2",
                text: "Purchase requested items",
                completed: false,
              },
              {
                id: "default-3",
                text: "Deliver items to home",
                completed: false,
              },
              {
                id: "default-4",
                text: "Help put items away",
                completed: false,
              },
              {
                id: "default-5",
                text: "Collect receipt and payment",
                completed: false,
              },
            ];
          } else if (serviceType.includes("medical")) {
            defaultItems = [
              {
                id: "default-1",
                text: "Arrive at senior's home",
                completed: false,
              },
              {
                id: "default-2",
                text: "Transport to medical appointment",
                completed: false,
              },
              {
                id: "default-3",
                text: "Assist during appointment if needed",
                completed: false,
              },
              {
                id: "default-4",
                text: "Collect any prescriptions",
                completed: false,
              },
              {
                id: "default-5",
                text: "Return senior safely home",
                completed: false,
              },
            ];
          } else {
            defaultItems = [
              { id: "default-1", text: "Arrive at location", completed: false },
              {
                id: "default-2",
                text: "Discuss service needs",
                completed: false,
              },
              {
                id: "default-3",
                text: "Complete requested tasks",
                completed: false,
              },
              {
                id: "default-4",
                text: "Review completed work",
                completed: false,
              },
              {
                id: "default-5",
                text: "Confirm service completion",
                completed: false,
              },
            ];
          }

          setItems(defaultItems);

          // Create a new checklist record with default items
          try {
            const { error: createError } = await supabase
              .from("service_checklists")
              .insert({
                service_request_id: serviceId,
                items: defaultItems,
                status: "in_progress",
              });

            if (createError) {
              console.error("Error creating default checklist:", createError);
              // Don't throw here, we'll still show the default items
            }
          } catch (insertError) {
            console.error("Exception creating default checklist:", insertError);
            // Don't throw here, we'll still show the default items
          }
        }
      } catch (error: any) {
        console.error("Error loading checklist:", error);
        setError(error.message || "Failed to load checklist");
        toast({
          variant: "destructive",
          title: "Failed to load checklist",
          description: "Using default checklist items instead.",
        });
        
        // Set default items as fallback
        setItems([
          { id: "fallback-1", text: "Arrive at location", completed: false },
          { id: "fallback-2", text: "Discuss service needs", completed: false },
          { id: "fallback-3", text: "Complete requested tasks", completed: false },
          { id: "fallback-4", text: "Review completed work", completed: false },
          { id: "fallback-5", text: "Confirm service completion", completed: false },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadChecklist();
  }, [serviceId, serviceType, toast]);

  // Toggle item completion
  const toggleItem = (id: string) => {
    if (isCompleted && !isHelper) return; // Only helpers can modify completed checklists

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              completedAt: !item.completed ? new Date() : undefined,
            }
          : item,
      ),
    );
  };

  // Add new item
  const addItem = () => {
    if (!newItemText.trim() || isCompleted) return;

    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      text: newItemText.trim(),
      completed: false,
    };

    setItems([...items, newItem]);
    setNewItemText("");
  };

  // Remove item
  const removeItem = (id: string) => {
    if (isCompleted) return;
    setItems(items.filter((item) => item.id !== id));
  };

  // Save checklist
  const saveChecklist = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("service_checklists")
        .update({
          items,
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq("service_request_id", serviceId);

      if (error) {
        console.error("Error saving checklist:", error);
        throw error;
      }

      toast({
        title: "Checklist saved",
        description: "Your service checklist has been updated.",
      });
    } catch (error: any) {
      console.error("Error saving checklist:", error);
      setError(error.message || "Failed to save checklist");
      toast({
        variant: "destructive",
        title: "Failed to save checklist",
        description: "Your changes have been saved locally but not synced to the server.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Complete service
  const completeService = async () => {
    // Check if all items are completed
    const allCompleted = items.every((item) => item.completed);

    if (!allCompleted) {
      toast({
        variant: "destructive",
        title: "Incomplete checklist",
        description: "Please complete all items before finishing the service.",
      });
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("service_checklists")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("service_request_id", serviceId);

      if (error) {
        console.error("Error completing service:", error);
        throw error;
      }

      toast({
        title: "Service completed",
        description: "The service has been marked as completed.",
      });

      if (onComplete) onComplete();
    } catch (error: any) {
      console.error("Error completing service:", error);
      setError(error.message || "Failed to complete service");
      toast({
        variant: "destructive",
        title: "Failed to complete service",
        description: "Please try again later or contact support if the issue persists.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate completion percentage
  const completionPercentage = items.length
    ? Math.round(
        (items.filter((item) => item.completed).length / items.length) * 100,
      )
    : 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Service Checklist</CardTitle>
          <Badge
            variant={completionPercentage === 100 ? "default" : "outline"}
            className={`${completionPercentage === 100 ? "bg-green-500" : ""}`}
          >
            {completionPercentage}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start space-x-3 p-3 rounded-md ${item.completed ? "bg-green-50" : "bg-gray-50"}`}
                >
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                    disabled={isCompleted && !isHelper}
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={`item-${item.id}`}
                      className={`text-base ${item.completed ? "line-through text-gray-500" : ""}`}
                    >
                      {item.text}
                    </Label>
                    {item.completed && item.completedAt && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Completed at {new Date(item.completedAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                  {!isCompleted && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add new item */}
            {!isCompleted && (
              <div className="flex space-x-2">
                <Input
                  placeholder="Add new task..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  className="flex-1"
                />
                <Button onClick={addItem}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            )}

            {/* Notes section */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-medium">
                Service Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about the service..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
                disabled={isCompleted && !isHelper}
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={saveChecklist}
                disabled={isSaving || (isCompleted && !isHelper)}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Progress
                  </>
                )}
              </Button>

              {isHelper && !isCompleted && (
                <Button
                  onClick={completeService}
                  disabled={isSaving || completionPercentage < 100}
                  className={
                    completionPercentage === 100
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4 mr-2" /> Complete Service
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Warning for incomplete checklist */}
            {isHelper && !isCompleted && completionPercentage < 100 && (
              <div className="flex items-start space-x-2 text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Checklist incomplete</p>
                  <p>
                    All tasks must be completed before you can finish the
                    service.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceChecklist;