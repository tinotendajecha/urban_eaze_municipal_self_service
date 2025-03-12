"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Building2,
  Droplets,
  Trash2,
} from "lucide-react";

interface Bill {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  description: string;
}

const mockBills: Bill[] = [
  {
    id: "1",
    type: "Property Tax",
    amount: 1200.00,
    dueDate: "2025-04-15",
    description: "Q2 2025 Property Tax"
  },
  {
    id: "2",
    type: "Water",
    amount: 85.50,
    dueDate: "2025-04-01",
    description: "March 2025 Water Bill"
  },
  {
    id: "3",
    type: "Waste",
    amount: 45.00,
    dueDate: "2025-04-01",
    description: "March 2025 Waste Collection"
  }
];

export default function PaymentPage() {
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const totalAmount = mockBills
    .filter(bill => selectedBills.includes(bill.id))
    .reduce((sum, bill) => sum + bill.amount, 0);

  const getBillIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'property tax':
        return <Building2 className="h-5 w-5" />;
      case 'water':
        return <Droplets className="h-5 w-5" />;
      case 'waste':
        return <Trash2 className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const handlePayment = () => {
    // Handle payment processing
    console.log('Processing payment:', {
      bills: selectedBills,
      amount: totalAmount,
      method: paymentMethod,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Make Bill Payment</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Outstanding Bills</h2>
            <div className="space-y-4">
              {mockBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center space-x-4 p-4 rounded-lg border cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    if (selectedBills.includes(bill.id)) {
                      setSelectedBills(selectedBills.filter(id => id !== bill.id));
                    } else {
                      setSelectedBills([...selectedBills, bill.id]);
                    }
                  }}
                >
                  <div className="flex-shrink-0 text-gray-500">
                    {getBillIcon(bill.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {bill.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(bill.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold">
                      ${bill.amount.toFixed(2)}
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedBills.includes(bill.id)}
                      onChange={() => {}}
                      className="h-4 w-4 text-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        maxLength={4}
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-2">
                  <Label>Bank Account</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account1">**** 1234</SelectItem>
                      <SelectItem value="account2">**** 5678</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold">${totalAmount.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={selectedBills.length === 0}
                  onClick={handlePayment}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}