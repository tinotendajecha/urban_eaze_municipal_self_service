"use client";

import { useEffect, useState } from "react";
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


interface Bill {
  id: string;
  residentId: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  type: "water" | "property_tax" | "waste" | "streetlight" | "other";
  description: string;
  createdAt: string;
  paidAt?: string;
  paymentMethod?: string;
  paymentReference?: string;
}

interface Payment {
  id: string;
  account?: string;
  amountPaid?: string;
  paymentMethod?: string;
  transactionCode?: string;
  transactionId?: string;
  description?: string;
  payment_for?: string;
  status?: string;
  reference?: string;
  createdAt?: Date;
  Bill?: Bill;
  billId?: string;
}

interface Resident {
  id: string;
  name?: string;
  address?: string;
  balance?: number;
  bills?: Bill[];
  email?: string;
  phone?: string;
  role?: string;
  standType?: string;
  createdAt?: Date;
  payments?: Payment[];
}

// Mock data - replace with your actual data fetching logic
const mockResidents: Resident[] = [
  {
    id: "1",
    name: "John Doe",
    address: "123 Main St",
    balance: 250.0,
    bills: [
      {
        id: "BILL-001",
        residentId: "1",
        amount: 150.0,
        dueDate: "2024-04-15T00:00:00.000Z",
        status: "pending",
        type: "water",
        description: "March 2024 Water Bill",
        createdAt: "2024-03-15T00:00:00.000Z",
      },
      {
        id: "BILL-002",
        residentId: "1",
        amount: 100.0,
        dueDate: "2024-04-15T00:00:00.000Z",
        status: "paid",
        type: "waste",
        description: "Q1 2024 Waste Management",
        createdAt: "2024-03-01T00:00:00.000Z",
        paidAt: "2024-03-10T00:00:00.000Z",
        paymentMethod: "credit_card",
        paymentReference: "PAY-123456",
      },
    ],
    email: "john@example.com",
    phone: "+1234567890",
  },
];


export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("residents");
  const [residents, setResidents] = useState(mockResidents);

  useEffect(() => {
    async function fetchUsers(){
      const response = await fetch('/api/users/all')

      if (response.ok) {
        const data = await response.json()
        setResidents(data.users)
        // console.log(data)
      }
    }

    fetchUsers()
  }, [])

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.phone!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.address!.toLowerCase().includes(searchTerm.toLowerCase())
  );

 

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
              <p className="text-2xl font-semibold">{residents.length}</p>
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
                  .reduce((sum, r) => sum + (r.balance! > 0 ? r.balance! : 0), 0)
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
                    (sum, r) => sum + (r.balance! < 0 ? Math.abs(r.balance!) : 0),
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
                    <h3 className="font-semibold text-base">{resident.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{resident.phone}</span>
                      <span>•</span>
                      <span>{resident.address}</span>
                    </div>
                  </div>
                  <Badge
                    variant={resident.balance! > 0 ? "destructive" : "secondary"}
                  >
                    ${Math.abs(resident.balance!).toFixed(2)}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Last Bill</span>
                    <span className="text-sm">
                      {new Date().toLocaleDateString()}
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
