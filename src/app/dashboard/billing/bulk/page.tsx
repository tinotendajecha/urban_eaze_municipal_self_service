"use client";
import React, { useEffect, useState } from "react";
import { HomeIcon, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface BulkBillFormData {
  payment_for: string;
  amountPaid: number;
  dueDate: string;
  description: string;
  filter?: string;
  userId: string;
  standType: string;
}

// Dummy lists
const billTypes = [
  { value: "water", label: "Water" },
  { value: "refuse", label: "Refuse Collection" },
  { value: "streetlight", label: "Street Lighting" },
  { value: "property_tax", label: "Property Tax" },
];

const standTypes = [
  { value: "ALL", label: "All" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "OTHER", label: "Other" },
  { value: "RESIDENTIAL", label: "Residential" },
];

const applyToOptions = [
  { value: "ALL", label: "All Residents" },
  { value: "RESIDENTIAL", label: "Residential Only" },
  { value: "COMMERCIAL", label: "Commercial Only" },
  { value: "outstanding", label: "With Outstanding Balance" },
];

const residents = [
  { id: 1, name: "John Doe", type: "residential" },
  { id: 2, name: "Jane Smith", type: "commercial" },
  { id: 3, name: "Mike Johnson", type: "residential" },
  { id: 4, name: "Alice Brown", type: "commercial" },
  { id: 5, name: "Sam Green", type: "outstanding" },
];

export default function BulkBilling() {
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<BulkBillFormData>({
    payment_for: "",
    amountPaid: 0,
    dueDate: "",
    description: "",
    filter: "all",
    userId: "",
    standType: "",
  });

  useEffect(() => {
    setFormData({ ...formData, userId: session?.user.id! });
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("data: ", formData);

    const response = await fetch("/api/bills/residents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({userId: formData.userId,
        amountPaid: formData.amountPaid,
        paymentMethod: "BILL ENTRY",
        description: formData.description,
        standType: formData.standType,
        payment_for: formData.payment_for,}),
    });

    const data = await response.json();

    if (response.status != 201) {
      toast.error("Something went wrong!");
      return;
    }

    toast.success("Bills generated successfully 🙂");

    // push to billing dashboard
    router.push("/dashboard/billing");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <UserCog className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bulk Billing Management System
              </h1>
              <p className="text-sm text-gray-600">
                Generate and manage bills for residents efficiently
              </p>
            </div>
            <div>
              <Link
                href={"/dashboard/billing"}
                className="flex align-middle items-center"
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Generate Bulk Bills
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Enter the billing details and select applicable residents to
              generate bulk bills.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment_for">Bill Type</Label>
                <Select
                  value={formData.payment_for}
                  onValueChange={(value) =>
                    setFormData({ ...formData, payment_for: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bill type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-300">
                    {billTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_for">Stand Type</Label>
                <Select
                  value={formData.standType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, standType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stand type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-300">
                    {standTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount per Resident ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amountPaid}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amountPaid: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter bill description"
                />
              </div>


              <Button type="submit" className="w-full">
                Generate Bills
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
