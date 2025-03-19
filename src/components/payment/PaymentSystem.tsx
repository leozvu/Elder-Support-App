import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  Trash2,
  Edit,
  CreditCard as CreditCardIcon,
  Wallet,
  Receipt,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PaymentMethod {
  id: string;
  type: "credit_card" | "bank_account" | "paypal";
  name: string;
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
  receiptUrl?: string;
  serviceId?: string;
}

interface PaymentSystemProps {
  paymentMethods?: PaymentMethod[];
  transactions?: Transaction[];
  onAddPaymentMethod?: (method: Omit<PaymentMethod, "id">) => void;
  onRemovePaymentMethod?: (id: string) => void;
  onSetDefaultPaymentMethod?: (id: string) => void;
  onMakePayment?: (
    amount: number,
    methodId: string,
    description: string,
  ) => void;
  userType?: "elderly" | "helper";
}

const PaymentSystem = ({
  paymentMethods: initialPaymentMethods = [
    {
      id: "1",
      type: "credit_card",
      name: "Visa ending in 4242",
      last4: "4242",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "bank_account",
      name: "Checking Account",
      last4: "1234",
      isDefault: false,
    },
  ],
  transactions: initialTransactions = [
    {
      id: "tx1",
      date: "2023-05-15",
      amount: 25.0,
      description: "Shopping Assistance",
      status: "completed",
      paymentMethod: "Visa ending in 4242",
      receiptUrl: "#",
      serviceId: "srv1",
    },
    {
      id: "tx2",
      date: "2023-05-10",
      amount: 35.5,
      description: "Medical Appointment",
      status: "completed",
      paymentMethod: "Visa ending in 4242",
      receiptUrl: "#",
      serviceId: "srv2",
    },
    {
      id: "tx3",
      date: "2023-05-05",
      amount: 15.0,
      description: "Grocery Delivery",
      status: "completed",
      paymentMethod: "Checking Account",
      receiptUrl: "#",
      serviceId: "srv3",
    },
  ],
  onAddPaymentMethod = () => {},
  onRemovePaymentMethod = () => {},
  onSetDefaultPaymentMethod = () => {},
  onMakePayment = () => {},
  userType = "elderly",
}: PaymentSystemProps) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialPaymentMethods,
  );
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState("payment-methods");
  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentMethods[0]?.id || "",
  );
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentDescription, setPaymentDescription] = useState<string>("");
  const [paymentErrors, setPaymentErrors] = useState({
    amount: "",
    method: "",
    description: "",
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // New payment method form state
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "credit_card" as const,
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    accountNumber: "",
    routingNumber: "",
    isDefault: false,
  });
  const [newPaymentMethodErrors, setNewPaymentMethodErrors] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    accountNumber: "",
    routingNumber: "",
  });

  const handleAddPaymentMethod = () => {
    // Validate based on payment method type
    let isValid = true;
    const errors = {
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      accountNumber: "",
      routingNumber: "",
    };

    if (!newPaymentMethod.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (newPaymentMethod.type === "credit_card") {
      if (!newPaymentMethod.cardNumber.trim()) {
        errors.cardNumber = "Card number is required";
        isValid = false;
      } else if (
        !/^\d{16}$/.test(newPaymentMethod.cardNumber.replace(/\s/g, ""))
      ) {
        errors.cardNumber = "Invalid card number";
        isValid = false;
      }

      if (!newPaymentMethod.expiryDate.trim()) {
        errors.expiryDate = "Expiry date is required";
        isValid = false;
      } else if (!/^\d{2}\/\d{2}$/.test(newPaymentMethod.expiryDate)) {
        errors.expiryDate = "Invalid format (MM/YY)";
        isValid = false;
      }

      if (!newPaymentMethod.cvv.trim()) {
        errors.cvv = "CVV is required";
        isValid = false;
      } else if (!/^\d{3,4}$/.test(newPaymentMethod.cvv)) {
        errors.cvv = "Invalid CVV";
        isValid = false;
      }
    } else if (newPaymentMethod.type === "bank_account") {
      if (!newPaymentMethod.accountNumber.trim()) {
        errors.accountNumber = "Account number is required";
        isValid = false;
      } else if (
        !/^\d{8,17}$/.test(newPaymentMethod.accountNumber.replace(/\s/g, ""))
      ) {
        errors.accountNumber = "Invalid account number";
        isValid = false;
      }

      if (!newPaymentMethod.routingNumber.trim()) {
        errors.routingNumber = "Routing number is required";
        isValid = false;
      } else if (!/^\d{9}$/.test(newPaymentMethod.routingNumber)) {
        errors.routingNumber = "Invalid routing number";
        isValid = false;
      }
    }

    setNewPaymentMethodErrors(errors);

    if (!isValid) return;

    // Create new payment method object
    const method: Omit<PaymentMethod, "id"> = {
      type: newPaymentMethod.type,
      name: newPaymentMethod.name,
      last4:
        newPaymentMethod.type === "credit_card"
          ? newPaymentMethod.cardNumber.slice(-4)
          : newPaymentMethod.accountNumber.slice(-4),
      expiryDate:
        newPaymentMethod.type === "credit_card"
          ? newPaymentMethod.expiryDate
          : undefined,
      isDefault: newPaymentMethod.isDefault,
    };

    // Call the provided callback
    onAddPaymentMethod(method);

    // Add to local state with a generated ID
    const newMethod = {
      ...method,
      id: `pm_${Date.now()}`,
    };

    // If this is the first payment method or isDefault is true, make it the default
    if (newMethod.isDefault || paymentMethods.length === 0) {
      setPaymentMethods((prev) =>
        prev
          .map((pm) => ({ ...pm, isDefault: false }))
          .concat({ ...newMethod, isDefault: true }),
      );
    } else {
      setPaymentMethods((prev) => [...prev, newMethod]);
    }

    // Reset form and close dialog
    resetPaymentMethodForm();
    setIsAddPaymentMethodOpen(false);
  };

  const resetPaymentMethodForm = () => {
    setNewPaymentMethod({
      type: "credit_card",
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      accountNumber: "",
      routingNumber: "",
      isDefault: false,
    });
    setNewPaymentMethodErrors({
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      accountNumber: "",
      routingNumber: "",
    });
  };

  const handleRemovePaymentMethod = (id: string) => {
    onRemovePaymentMethod(id);
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    onSetDefaultPaymentMethod(id);
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  const handleMakePayment = () => {
    // Validate payment form
    let isValid = true;
    const errors = { amount: "", method: "", description: "" };

    if (!paymentAmount.trim()) {
      errors.amount = "Amount is required";
      isValid = false;
    } else if (!/^\d+(\.\d{1,2})?$/.test(paymentAmount)) {
      errors.amount = "Invalid amount format";
      isValid = false;
    }

    if (!selectedPaymentMethod) {
      errors.method = "Please select a payment method";
      isValid = false;
    }

    if (!paymentDescription.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    setPaymentErrors(errors);

    if (!isValid) return;

    // Process payment
    setIsProcessingPayment(true);

    // Simulate API call
    setTimeout(() => {
      const amount = parseFloat(paymentAmount);
      onMakePayment(amount, selectedPaymentMethod, paymentDescription);

      // Add to local transactions
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        amount,
        description: paymentDescription,
        status: "completed",
        paymentMethod:
          paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name ||
          "Unknown",
        receiptUrl: "#",
      };

      setTransactions((prev) => [newTransaction, ...prev]);
      setIsProcessingPayment(false);
      setPaymentSuccess(true);

      // Reset after showing success
      setTimeout(() => {
        setPaymentSuccess(false);
        setIsPaymentDialogOpen(false);
        resetPaymentForm();
      }, 2000);
    }, 1500);
  };

  const resetPaymentForm = () => {
    setPaymentAmount("");
    setPaymentDescription("");
    setPaymentErrors({ amount: "", method: "", description: "" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "credit_card":
        return <CreditCardIcon className="h-5 w-5" />;
      case "bank_account":
        return <Wallet className="h-5 w-5" />;
      case "paypal":
        return <DollarSign className="h-5 w-5" />;
      default:
        return <CreditCardIcon className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <DollarSign className="mr-2 h-6 w-6 text-primary" />
          Payment Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="payment-methods"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment-methods" className="text-lg py-3">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-lg py-3">
              <Receipt className="mr-2 h-5 w-5" />
              Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payment-methods" className="pt-4">
            <div className="space-y-4">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No payment methods added yet</p>
                </div>
              ) : (
                paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {getPaymentMethodIcon(method.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{method.name}</h3>
                          {method.isDefault && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-primary/10"
                            >
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>
                            {method.type === "credit_card"
                              ? `Expires ${method.expiryDate}`
                              : "Bank Account"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleSetDefaultPaymentMethod(method.id)
                          }
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}

              <Dialog
                open={isAddPaymentMethodOpen}
                onOpenChange={setIsAddPaymentMethodOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                      Add a new payment method to your account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={
                          newPaymentMethod.type === "credit_card"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            type: "credit_card",
                          })
                        }
                        className="flex items-center justify-center gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        Credit Card
                      </Button>
                      <Button
                        type="button"
                        variant={
                          newPaymentMethod.type === "bank_account"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            type: "bank_account",
                          })
                        }
                        className="flex items-center justify-center gap-2"
                      >
                        <Wallet className="h-4 w-4" />
                        Bank Account
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-name">Name</Label>
                      <Input
                        id="payment-name"
                        value={newPaymentMethod.name}
                        onChange={(e) =>
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            name: e.target.value,
                          })
                        }
                        placeholder={
                          newPaymentMethod.type === "credit_card"
                            ? "My Visa Card"
                            : "My Checking Account"
                        }
                      />
                      {newPaymentMethodErrors.name && (
                        <p className="text-sm text-red-500">
                          {newPaymentMethodErrors.name}
                        </p>
                      )}
                    </div>

                    {newPaymentMethod.type === "credit_card" ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input
                            id="card-number"
                            value={newPaymentMethod.cardNumber}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                cardNumber: e.target.value,
                              })
                            }
                            placeholder="4242 4242 4242 4242"
                          />
                          {newPaymentMethodErrors.cardNumber && (
                            <p className="text-sm text-red-500">
                              {newPaymentMethodErrors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry-date">Expiry Date</Label>
                            <Input
                              id="expiry-date"
                              value={newPaymentMethod.expiryDate}
                              onChange={(e) =>
                                setNewPaymentMethod({
                                  ...newPaymentMethod,
                                  expiryDate: e.target.value,
                                })
                              }
                              placeholder="MM/YY"
                            />
                            {newPaymentMethodErrors.expiryDate && (
                              <p className="text-sm text-red-500">
                                {newPaymentMethodErrors.expiryDate}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={newPaymentMethod.cvv}
                              onChange={(e) =>
                                setNewPaymentMethod({
                                  ...newPaymentMethod,
                                  cvv: e.target.value,
                                })
                              }
                              placeholder="123"
                            />
                            {newPaymentMethodErrors.cvv && (
                              <p className="text-sm text-red-500">
                                {newPaymentMethodErrors.cvv}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="account-number">Account Number</Label>
                          <Input
                            id="account-number"
                            value={newPaymentMethod.accountNumber}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                accountNumber: e.target.value,
                              })
                            }
                            placeholder="12345678"
                          />
                          {newPaymentMethodErrors.accountNumber && (
                            <p className="text-sm text-red-500">
                              {newPaymentMethodErrors.accountNumber}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="routing-number">Routing Number</Label>
                          <Input
                            id="routing-number"
                            value={newPaymentMethod.routingNumber}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                routingNumber: e.target.value,
                              })
                            }
                            placeholder="123456789"
                          />
                          {newPaymentMethodErrors.routingNumber && (
                            <p className="text-sm text-red-500">
                              {newPaymentMethodErrors.routingNumber}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="make-default"
                        checked={newPaymentMethod.isDefault}
                        onChange={(e) =>
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            isDefault: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label
                        htmlFor="make-default"
                        className="text-sm font-normal"
                      >
                        Make this my default payment method
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddPaymentMethodOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddPaymentMethod}>
                      Add Payment Method
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {userType === "elderly" && (
                <Dialog
                  open={isPaymentDialogOpen}
                  onOpenChange={setIsPaymentDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full mt-4"
                      disabled={paymentMethods.length === 0}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Make a Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Make a Payment</DialogTitle>
                      <DialogDescription>
                        Pay for services or add funds to your account
                      </DialogDescription>
                    </DialogHeader>

                    {!paymentSuccess ? (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="payment-amount">Amount ($)</Label>
                          <Input
                            id="payment-amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="25.00"
                            type="text"
                            inputMode="decimal"
                          />
                          {paymentErrors.amount && (
                            <p className="text-sm text-red-500">
                              {paymentErrors.amount}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payment-method">Payment Method</Label>
                          <select
                            id="payment-method"
                            value={selectedPaymentMethod}
                            onChange={(e) =>
                              setSelectedPaymentMethod(e.target.value)
                            }
                            className="w-full p-2 border rounded-md"
                          >
                            {paymentMethods.map((method) => (
                              <option key={method.id} value={method.id}>
                                {method.name}
                              </option>
                            ))}
                          </select>
                          {paymentErrors.method && (
                            <p className="text-sm text-red-500">
                              {paymentErrors.method}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payment-description">
                            Description
                          </Label>
                          <Input
                            id="payment-description"
                            value={paymentDescription}
                            onChange={(e) =>
                              setPaymentDescription(e.target.value)
                            }
                            placeholder="Service payment"
                          />
                          {paymentErrors.description && (
                            <p className="text-sm text-red-500">
                              {paymentErrors.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-green-800 mb-1">
                          Payment Successful!
                        </h3>
                        <p className="text-gray-500">
                          Your payment has been processed successfully.
                        </p>
                      </div>
                    )}

                    <DialogFooter>
                      {!paymentSuccess && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => setIsPaymentDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleMakePayment}
                            disabled={isProcessingPayment}
                          >
                            {isProcessingPayment ? (
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
                                Processing...
                              </>
                            ) : (
                              <>Pay Now</>
                            )}
                          </Button>
                        </>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="pt-4">
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No transaction history yet</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            Payment Method
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                            Receipt
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {formatDate(transaction.date)}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {transaction.description}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge
                                className={getStatusColor(transaction.status)}
                              >
                                {transaction.status.charAt(0).toUpperCase() +
                                  transaction.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {transaction.paymentMethod}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              {transaction.receiptUrl && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a
                                    href={transaction.receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentSystem;
