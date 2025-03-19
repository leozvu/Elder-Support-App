import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  Edit,
  Save,
  PlusCircle,
  MinusCircle,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Sample data - in a real app, this would come from a database
  const [user, setUser] = useState({
    name: "Martha Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
    address: "123 Maple Street, Anytown",
    phone: "(555) 123-4567",
    email: "martha.j@example.com",
    memberSince: "January 2023",
    emergencyContacts: [
      { name: "Robert Johnson", relation: "Son", phone: "(555) 987-6543" },
      { name: "Sarah Williams", relation: "Daughter", phone: "(555) 456-7890" },
    ],
    serviceHistory: [
      {
        id: "SR-1234",
        type: "Medical Appointment",
        date: "May 15, 2023",
        helper: "John Smith",
        status: "Completed",
        rating: 5,
      },
      {
        id: "SR-1235",
        type: "Grocery Shopping",
        date: "May 10, 2023",
        helper: "Emma Davis",
        status: "Completed",
        rating: 4,
      },
      {
        id: "SR-1236",
        type: "Home Assistance",
        date: "May 5, 2023",
        helper: "Michael Brown",
        status: "Completed",
        rating: 5,
      },
    ],
    preferences: [
      "Prefers female helpers",
      "No pets",
      "Needs assistance with stairs",
      "Hearing impaired - please speak clearly",
    ],
    // New detailed preferences
    dietaryRequirements: "Low sodium diet, no dairy products",
    mobilityRestrictions: "Uses a walker, difficulty with stairs",
    communicationPreferences:
      "Prefers phone calls over text messages, hearing impaired",
    medicalConditions: "Type 2 diabetes, high blood pressure, mild arthritis",
    preferredHelperGender: "female",
    specialInstructions:
      "Please speak clearly and face me when speaking due to hearing impairment.",
  });

  const [newPreference, setNewPreference] = useState("");

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would update the user profile in Supabase
      // const { error } = await supabase
      //   .from('users')
      //   .update({
      //     dietary_requirements: user.dietaryRequirements,
      //     mobility_restrictions: user.mobilityRestrictions,
      //     communication_preferences: user.communicationPreferences,
      //     medical_conditions: user.medicalConditions,
      //     preferred_helper_gender: user.preferredHelperGender,
      //     special_instructions: user.specialInstructions
      //   })
      //   .eq('id', userId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addPreference = () => {
    if (newPreference.trim() !== "") {
      setUser({
        ...user,
        preferences: [...user.preferences, newPreference.trim()],
      });
      setNewPreference("");
    }
  };

  const removePreference = (index) => {
    setUser({
      ...user,
      preferences: user.preferences.filter((_, i) => i !== index),
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground mb-4">
                  Member since {user.memberSince}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.address}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>

                <Button className="mt-4 w-full">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="history">Service History</TabsTrigger>
                <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* Service History Tab */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Service History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.serviceHistory.map((service) => (
                        <div key={service.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{service.type}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{service.date}</span>
                              </div>
                            </div>
                            <Badge
                              variant={
                                service.status === "Completed"
                                  ? "success"
                                  : "default"
                              }
                            >
                              {service.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              Helper: {service.helper}
                            </span>
                            <div className="flex items-center">
                              <span className="text-sm mr-1">Rating:</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < service.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All History
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Emergency Contacts Tab */}
              <TabsContent value="emergency">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.emergencyContacts.map((contact, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{contact.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {contact.relation}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-primary" />
                              <span>{contact.phone}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button className="flex-1">Add Contact</Button>
                      <Button variant="outline" className="flex-1">
                        Edit Contacts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Service Preferences</CardTitle>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" /> Save
                          </>
                        )}
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            General Preferences
                          </h3>

                          <div className="space-y-2">
                            {user.preferences.map((pref, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-muted p-2 rounded-md"
                              >
                                <span>{pref}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePreference(index)}
                                >
                                  <MinusCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Input
                              placeholder="Add new preference..."
                              value={newPreference}
                              onChange={(e) => setNewPreference(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && addPreference()
                              }
                            />
                            <Button onClick={addPreference}>
                              <PlusCircle className="h-4 w-4 mr-2" /> Add
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Detailed Preferences
                          </h3>

                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <Label htmlFor="dietaryRequirements">
                                Dietary Requirements
                              </Label>
                              <Textarea
                                id="dietaryRequirements"
                                placeholder="Enter any dietary requirements or restrictions"
                                value={user.dietaryRequirements}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    dietaryRequirements: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="mobilityRestrictions">
                                Mobility Restrictions
                              </Label>
                              <Textarea
                                id="mobilityRestrictions"
                                placeholder="Describe any mobility limitations or requirements"
                                value={user.mobilityRestrictions}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    mobilityRestrictions: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="communicationPreferences">
                                Communication Preferences
                              </Label>
                              <Textarea
                                id="communicationPreferences"
                                placeholder="How do you prefer to communicate?"
                                value={user.communicationPreferences}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    communicationPreferences: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="medicalConditions">
                                Medical Conditions
                              </Label>
                              <Textarea
                                id="medicalConditions"
                                placeholder="List any medical conditions helpers should be aware of"
                                value={user.medicalConditions}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    medicalConditions: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="preferredHelperGender">
                                Preferred Helper Gender
                              </Label>
                              <Select
                                value={user.preferredHelperGender}
                                onValueChange={(value) =>
                                  setUser({
                                    ...user,
                                    preferredHelperGender: value,
                                  })
                                }
                              >
                                <SelectTrigger id="preferredHelperGender">
                                  <SelectValue placeholder="Select preferred gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="no_preference">
                                    No Preference
                                  </SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="male">Male</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="specialInstructions">
                                Special Instructions for Helpers
                              </Label>
                              <Textarea
                                id="specialInstructions"
                                placeholder="Any special instructions or notes for helpers"
                                value={user.specialInstructions}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    specialInstructions: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            General Preferences
                          </h3>
                          <div className="space-y-2">
                            {user.preferences.map((pref, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="mr-2 mb-2 py-2"
                              >
                                {pref}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Detailed Preferences
                          </h3>

                          <div className="border rounded-lg p-4 space-y-4">
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">
                                Dietary Requirements
                              </h4>
                              <p>
                                {user.dietaryRequirements || "None specified"}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">
                                Mobility Restrictions
                              </h4>
                              <p>
                                {user.mobilityRestrictions || "None specified"}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">
                                Communication Preferences
                              </h4>
                              <p>
                                {user.communicationPreferences ||
                                  "None specified"}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">
                                Medical Conditions
                              </h4>
                              <p>
                                {user.medicalConditions || "None specified"}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">
                                Preferred Helper Gender
                              </h4>
                              <p>
                                {user.preferredHelperGender === "no_preference"
                                  ? "No Preference"
                                  : user.preferredHelperGender === "female"
                                    ? "Female"
                                    : user.preferredHelperGender === "male"
                                      ? "Male"
                                      : "Not specified"}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">
                                Special Instructions
                              </h4>
                              <p>
                                {user.specialInstructions || "None specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
