import React from "react";
import Layout from "@/components/layout/Layout";
import PaymentSystem from "@/components/payment/PaymentSystem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CreditCard, DollarSign, BarChart4 } from "lucide-react";

const PaymentManagement = () => {
  // Sample data - in a real app, this would come from an API
  const paymentStats = {
    totalEarnings: "$1,240.50",
    pendingPayments: "$320.00",
    lastPayment: "$180.25",
    paymentMethod: "Direct Deposit",
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Payment Management</h1>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Earnings</p>
                  <p className="text-2xl font-bold">
                    {paymentStats.totalEarnings}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Payments</p>
                  <p className="text-2xl font-bold">
                    {paymentStats.pendingPayments}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Wallet className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Last Payment</p>
                  <p className="text-2xl font-bold">
                    {paymentStats.lastPayment}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-2xl font-bold">
                    {paymentStats.paymentMethod}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart4 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Payment System */}
        <PaymentSystem />
      </div>
    </Layout>
  );
};

export default PaymentManagement;
