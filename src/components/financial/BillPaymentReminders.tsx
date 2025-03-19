import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Bell,
  AlertCircle,
  DollarSign,
  Lock,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import AccessibleInput from "@/components/accessibility/AccessibleInput";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  recurring: boolean;
  reminderDays: number;
  paymentAssistanceEnabled: boolean;
  category: string;
  paid: boolean;
}

const BillPaymentReminders = () => {
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([
    {
      id: "1",
      name: "Electricity Bill",
      amount: 85.42,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      recurring: true,
      reminderDays: 3,
      paymentAssistanceEnabled: false,
      category: "Utilities",
      paid: false,
    },
    {
      id: "2",
      name: "Water Bill",
      amount: 45.0,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 12)),
      recurring: true,
      reminderDays: 5,
      paymentAssistanceEnabled: false,
      category: "Utilities",
      paid: false,
    },
    {
      id: "3",
      name: "Phone Bill",
      amount: 35.99,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 8)),
      recurring: true,
      reminderDays: 3,
      paymentAssistanceEnabled: false,
      category: "Utilities",
      paid: false,
    },
    {
      id: "4",
      name: "Medicare Premium",
      amount: 148.5,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
      recurring: true,
      reminderDays: 7,
      paymentAssistanceEnabled: true,
      category: "Healthcare",
      paid: false,
    },
  ]);

  const [showAddBill, setShowAddBill] = useState(false);
  const [newBill, setNewBill] = useState<Partial<Bill>>({
    name: "",
    amount: 0,
    dueDate: new Date(),
    recurring: false,
    reminderDays: 3,
    paymentAssistanceEnabled: false,
    category: "Utilities",
    paid: false,
  });

  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount || !newBill.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const bill: Bill = {
      id: `bill-${Date.now()}`,
      name: newBill.name || "",
      amount: newBill.amount || 0,
      dueDate: newBill.dueDate || new Date(),
      recurring: newBill.recurring || false,
      reminderDays: newBill.reminderDays || 3,
      paymentAssistanceEnabled: newBill.paymentAssistanceEnabled || false,
      category: newBill.category || "Utilities",
      paid: false,
    };

    setBills([...bills, bill]);
    setNewBill({
      name: "",
      amount: 0,
      dueDate: new Date(),
      recurring: false,
      reminderDays: 3,
      paymentAssistanceEnabled: false,
      category: "Utilities",
      paid: false,
    });
    setShowAddBill(false);

    toast({
      title: "Bill Added",
      description: `${bill.name} has been added to your reminders`,
    });
  };

  const handleTogglePaid = (id: string) => {
    setBills(
      bills.map((bill) =>
        bill.id === id ? { ...bill, paid: !bill.paid } : bill,
      ),
    );
  };

  const handleToggleAssistance = (id: string) => {
    setBills(
      bills.map((bill) =>
        bill.id === id
          ? {
              ...bill,
              paymentAssistanceEnabled: !bill.paymentAssistanceEnabled,
            }
          : bill,
      ),
    );

    const bill = bills.find((b) => b.id === id);
    if (bill) {
      toast({
        title: bill.paymentAssistanceEnabled
          ? "Payment Assistance Disabled"
          : "Payment Assistance Enabled",
        description: bill.paymentAssistanceEnabled
          ? `Helpers will no longer be able to assist with ${bill.name} payments`
          : `Helpers can now assist with ${bill.name} payments when needed`,
      });
    }
  };

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
    toast({
      title: "Bill Removed",
      description: "The bill has been removed from your reminders",
    });
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (dueDate: Date, paid: boolean) => {
    if (paid) return "bg-green-100 text-green-800";

    const daysUntilDue = getDaysUntilDue(dueDate);
    if (daysUntilDue < 0) return "bg-red-100 text-red-800";
    if (daysUntilDue <= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const getStatusText = (dueDate: Date, paid: boolean) => {
    if (paid) return "Paid";

    const daysUntilDue = getDaysUntilDue(dueDate);
    if (daysUntilDue < 0) return "Overdue";
    if (daysUntilDue === 0) return "Due Today";
    if (daysUntilDue === 1) return "Due Tomorrow";
    return `Due in ${daysUntilDue} days`;
  };

  // Sort bills by due date (upcoming first) and paid status (unpaid first)
  const sortedBills = [...bills].sort((a, b) => {
    if (a.paid && !b.paid) return 1;
    if (!a.paid && b.paid) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold">
          <div className="flex items-center">
            <DollarSign className="mr-2 h-6 w-6 text-primary" />
            Bill Payment Reminders
          </div>
        </CardTitle>
        <Button onClick={() => setShowAddBill(!showAddBill)}>
          {showAddBill ? "Cancel" : "Add Bill"}
        </Button>
      </CardHeader>
      <CardContent>
        {showAddBill && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-semibold mb-4">Add New Bill</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <AccessibleInput
                    id="bill-name"
                    label="Bill Name"
                    value={newBill.name}
                    onChange={(e) =>
                      setNewBill({ ...newBill, name: e.target.value })
                    }
                    placeholder="e.g. Electricity Bill"
                    helpText="Enter the name of the bill"
                  />
                </div>
                <div className="space-y-2">
                  <AccessibleInput
                    id="bill-amount"
                    label="Amount ($)"
                    type="number"
                    value={newBill.amount?.toString() || ""}
                    onChange={(e) =>
                      setNewBill({
                        ...newBill,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    helpText="Enter the bill amount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bill-due-date">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="bill-due-date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newBill.dueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newBill.dueDate ? (
                          format(newBill.dueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newBill.dueDate}
                        onSelect={(date) =>
                          setNewBill({
                            ...newBill,
                            dueDate: date || new Date(),
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bill-category">Category</Label>
                  <select
                    id="bill-category"
                    className="w-full p-2 border rounded-md"
                    value={newBill.category}
                    onChange={(e) =>
                      setNewBill({ ...newBill, category: e.target.value })
                    }
                  >
                    <option value="Utilities">Utilities</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Housing">Housing</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bill-recurring"
                    checked={newBill.recurring}
                    onCheckedChange={(checked) =>
                      setNewBill({ ...newBill, recurring: checked })
                    }
                  />
                  <Label htmlFor="bill-recurring">Recurring Bill</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminder-days">Remind me</Label>
                  <select
                    id="reminder-days"
                    className="w-full p-2 border rounded-md"
                    value={newBill.reminderDays}
                    onChange={(e) =>
                      setNewBill({
                        ...newBill,
                        reminderDays: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="1">1 day before</option>
                    <option value="3">3 days before</option>
                    <option value="5">5 days before</option>
                    <option value="7">7 days before</option>
                    <option value="14">14 days before</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 border-t pt-4">
                <Switch
                  id="payment-assistance"
                  checked={newBill.paymentAssistanceEnabled}
                  onCheckedChange={(checked) =>
                    setNewBill({
                      ...newBill,
                      paymentAssistanceEnabled: checked,
                    })
                  }
                />
                <div>
                  <Label
                    htmlFor="payment-assistance"
                    className="flex items-center"
                  >
                    <Shield className="h-4 w-4 mr-1 text-primary" />
                    Enable Helper Payment Assistance
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow trusted helpers to assist with this bill payment when
                    needed
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setShowAddBill(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBill}>Add Bill</Button>
              </div>
            </div>
          </div>
        )}

        {sortedBills.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No bills added yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowAddBill(true)}
            >
              Add Your First Bill
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">
                    Bill Payment Reminders
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    You'll receive reminders before your bills are due. For
                    bills with payment assistance enabled, trusted helpers can
                    assist you with payments when needed.
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Bill
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Assistance
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sortedBills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium">{bill.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {bill.category}
                              {bill.recurring && (
                                <span className="ml-2">(Recurring)</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          ${bill.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          {format(new Date(bill.dueDate), "MMM d, yyyy")}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={getStatusColor(bill.dueDate, bill.paid)}
                          >
                            {getStatusText(bill.dueDate, bill.paid)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {bill.paymentAssistanceEnabled ? (
                            <div className="flex items-center text-green-600">
                              <Shield className="h-4 w-4 mr-1" />
                              <span className="text-xs">Enabled</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-muted-foreground">
                              <Lock className="h-4 w-4 mr-1" />
                              <span className="text-xs">Disabled</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTogglePaid(bill.id)}
                              className={bill.paid ? "text-green-600" : ""}
                            >
                              {bill.paid ? "Unpay" : "Mark Paid"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleAssistance(bill.id)}
                            >
                              {bill.paymentAssistanceEnabled
                                ? "Disable Assistance"
                                : "Enable Assistance"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDeleteBill(bill.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800">
                    Payment Assistance Security
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    When payment assistance is enabled, only trusted helpers who
                    have passed our verification process can assist with bill
                    payments. All payment activities are logged and monitored
                    for your security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillPaymentReminders;
