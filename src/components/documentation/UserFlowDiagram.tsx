import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserFlowDiagramProps {
  className?: string;
}

const UserFlowDiagram = ({ className = "" }: UserFlowDiagramProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">User Flow Diagrams</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="elderly">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="elderly">Elderly User</TabsTrigger>
            <TabsTrigger value="helper">Helper</TabsTrigger>
            <TabsTrigger value="admin">Hub Admin</TabsTrigger>
            <TabsTrigger value="caregiver">Caregiver</TabsTrigger>
          </TabsList>

          <TabsContent value="elderly" className="mt-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                Elderly User Journey
              </h3>
              <div className="overflow-auto">
                <div className="mermaid-diagram">
                  {`graph TD
                    A[Open App] --> B[Login/Register]
                    B --> C[View Dashboard]
                    C --> D{Select Action}
                    D -->|Request Service| E[Browse Service Categories]
                    E --> F[Select Service Type]
                    F --> G[Specify Details & Schedule]
                    G --> H[Review & Submit Request]
                    H --> I[Wait for Helper Match]
                    I --> J[Track Helper Arrival]
                    J --> K[Service Completion]
                    K --> L[Rate & Review Helper]
                    D -->|Emergency| M[Activate SOS Button]
                    M --> N[Alert Sent to Emergency Contacts]
                    M --> O[Alert Sent to Nearest Hub]
                    D -->|Medications| P[View Medication Schedule]
                    P --> Q[Mark Medications as Taken]
                    D -->|Wellness| R[Complete Wellness Check]
                    D -->|View History| S[Browse Past Services]
                    D -->|Community| T[View Community Events]
                    T --> U[Register for Event]
                    D -->|Settings| V[Adjust Accessibility Settings]`}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="helper" className="mt-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Helper Journey</h3>
              <div className="overflow-auto">
                <div className="mermaid-diagram">
                  {`graph TD
                    A[Open App] --> B[Login/Register]
                    B --> C{First Time Helper?}
                    C -->|Yes| D[Complete Profile & Verification]
                    D --> E[Background Check Process]
                    E --> F{Approved?}
                    F -->|No| G[Rejection Notification]
                    F -->|Yes| H[Helper Dashboard Access]
                    C -->|No| H
                    H --> I{Select Action}
                    I -->|View Requests| J[Browse Available Service Requests]
                    J --> K[Accept Service Request]
                    K --> L[Receive Service Details]
                    L --> M[Navigate to User Location]
                    M --> N[Perform Service]
                    N --> O[Mark Service Complete]
                    O --> P[Receive Payment]
                    I -->|Update Availability| Q[Set Working Hours]
                    I -->|View Earnings| R[Check Payment History]
                    I -->|View Schedule| S[Check Upcoming Services]
                    I -->|View Profile| T[Update Skills & Preferences]`}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                Hub Administrator Journey
              </h3>
              <div className="overflow-auto">
                <div className="mermaid-diagram">
                  {`graph TD
                    A[Login to Hub Dashboard] --> B[View Hub Overview]
                    B --> C{Select Management Area}
                    C -->|User Verification| D[Review New User Applications]
                    D --> E[Approve/Reject Users]
                    C -->|Helper Verification| F[Review Helper Applications]
                    F --> G[Conduct Background Checks]
                    G --> H[Approve/Reject Helpers]
                    C -->|Service Management| I[Monitor Active Services]
                    I --> J[Handle Service Issues]
                    C -->|Emergency Response| K[Monitor SOS Alerts]
                    K --> L[Coordinate Emergency Response]
                    C -->|Community Engagement| M[Organize Community Events]
                    M --> N[Publish Event Details]
                    N --> O[Track Event Registrations]
                    C -->|Analytics| P[Review Service Statistics]
                    P --> Q[Generate Reports]
                    C -->|Hub Settings| R[Update Hub Information]
                    R --> S[Manage Service Area]`}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="caregiver" className="mt-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                Caregiver/Family Member Journey
              </h3>
              <div className="overflow-auto">
                <div className="mermaid-diagram">
                  {`graph TD
                    A[Login to Family Portal] --> B[View Dashboard]
                    B --> C{Select Action}
                    C -->|Monitor Family Member| D[Select Family Member]
                    D --> E[View Current Status]
                    E --> F[Check Location]
                    E --> G[View Recent Activity]
                    C -->|Medication Management| H[View Medication Schedule]
                    H --> I[Set Medication Reminders]
                    H --> J[Monitor Adherence]
                    C -->|Service Management| K[View Service History]
                    K --> L[Request Service on Behalf]
                    C -->|Wellness Monitoring| M[View Wellness Metrics]
                    M --> N[Set Wellness Goals]
                    C -->|Communication| O[Video Call]
                    O --> P[Send Message]
                    C -->|Emergency| Q[View Emergency Contacts]
                    Q --> R[Update Emergency Information]
                    C -->|Settings| S[Manage Notification Preferences]`}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserFlowDiagram;
