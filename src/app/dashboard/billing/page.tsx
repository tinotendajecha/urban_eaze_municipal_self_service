"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Users, Search, Plus, FileText, Filter, Download } from "lucide-react";

// Mock data - replace with your actual data fetching logic
const mockResidents = [
  {
    id: "1",
    name: "John Doe",
    accountNumber: "ACC-001",
    address: "123 Main St",
    balance: 250.0,
    lastBillDate: "2024-03-15T00:00:00.000Z",
    bills: [],
  },
  {
    id: "2",
    name: "Jane Smith",
    accountNumber: "ACC-002",
    address: "456 Oak Ave",
    balance: 150.0,
    lastBillDate: "2024-03-10T00:00:00.000Z",
    bills: [],
  },
  {
    id: "3",
    name: "Bob Wilson",
    accountNumber: "ACC-003",
    address: "789 Pine Rd",
    balance: -50.0,
    lastBillDate: "2024-03-05T00:00:00.000Z",
    bills: [],
  },
];

interface BulkBillFormData {
  type: string;
  amount: number;
  dueDate: string;
  description: string;
  filter?: string;
}

const BulkBillForm = ({
  onSubmit,
}: {
  onSubmit: (data: BulkBillFormData) => void;
}) => {
  const [formData, setFormData] = useState<BulkBillFormData>({
    type: "",
    amount: 0,
    dueDate: "",
    description: "",
    filter: "all",
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Bill Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select bill type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-300">
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="refuse">Refuse Collection</SelectItem>
            <SelectItem value="streetlight">Street Lighting</SelectItem>
            <SelectItem value="property_tax">Property Tax</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount per Resident ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) })
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

      <div className="space-y-2">
        <Label htmlFor="filter">Apply To</Label>
        <Select
          value={formData.filter}
          onValueChange={(value) => setFormData({ ...formData, filter: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-300">
            <SelectItem value="all">All Residents</SelectItem>
            <SelectItem value="residential">Residential Only</SelectItem>
            <SelectItem value="commercial">Commercial Only</SelectItem>
            <SelectItem value="outstanding">
              With Outstanding Balance
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full mt-4" onClick={() => onSubmit(formData)}>
        Generate Bills
      </Button>
    </div>
  );
};

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("residents");

  const filteredResidents = mockResidents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBulkBilling = (data: BulkBillFormData) => {
    console.log("Generating bulk bills:", data);
    // Implement bulk billing logic
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing Management
          </h1>
          <p className="text-gray-500">Manage resident accounts and billing</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link
            href={"/dashboard/billing/bulk"}
            className="flex align-middle items-center font-semibold text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Bulk Bill Generation
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Total Residents</h3>
              <p className="text-2xl font-semibold">{mockResidents.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-full">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium">Outstanding Balance</h3>
              <p className="text-2xl font-semibold text-red-600">
                $
                {mockResidents
                  .reduce((sum, r) => sum + (r.balance > 0 ? r.balance : 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Total Collected</h3>
              <p className="text-2xl font-semibold text-green-600">
                $
                {mockResidents
                  .reduce(
                    (sum, r) => sum + (r.balance < 0 ? Math.abs(r.balance) : 0),
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="residents">Residents</TabsTrigger>
            <TabsTrigger value="recent">Recent Bills</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Bills</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4 my-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                className="pl-10"
                placeholder="Search residents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <TabsContent
            value="residents"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredResidents.map((resident) => (
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
                  <Badge
                    variant={resident.balance > 0 ? "destructive" : "secondary"}
                  >
                    ${Math.abs(resident.balance).toFixed(2)}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Last Bill</span>
                    <span className="text-sm">
                      {new Date(resident.lastBillDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-2">
                  <Link href={`/dashboard/billing/manage-bills/${resident.id}`}>
                    <Button>Manage Bills</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recent">
            <div className="text-center py-8 text-gray-500">
              Recent bills will be displayed here
            </div>
          </TabsContent>

          <TabsContent value="scheduled">
            <div className="text-center py-8 text-gray-500">
              Scheduled bills will be displayed here
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
