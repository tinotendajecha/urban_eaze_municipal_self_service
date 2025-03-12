"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users } from "lucide-react";

// Mock data - replace with your actual data fetching logic
const mockResidents = [
  {
    id: "1",
    name: "John Doe",
    accountNumber: "ACC-001",
    address: "123 Main St",
    balance: 250.00,
    lastBillDate: "2024-03-15T00:00:00.000Z",
    bills: []
  },
  // Add more mock residents as needed
];

export default function BillingPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing Management</h1>
          <p className="text-gray-500">Manage resident accounts and billing</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockResidents.map((resident) => (
          <Card key={resident.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{resident.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{resident.accountNumber}</span>
                  <span>•</span>
                  <span>{resident.address}</span>
                </div>
              </div>
              <Users className="h-5 w-5 text-gray-400" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Current Balance</span>
                <span className={`font-semibold ${resident.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${resident.balance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Last Bill</span>
                <span className="text-sm">
                  {new Date(resident.lastBillDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-2">
              <Link href={`/dashboard/billing/manage-bills/${resident.id}`}>
                <Button>
                  Manage Bills
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}