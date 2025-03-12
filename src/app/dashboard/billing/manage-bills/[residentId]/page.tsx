"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  History,
  Download,
  Send,
  ArrowLeft,
  MoreHorizontal
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const billTypes = {
  water: 'Water Bill',
  property_tax: 'Property Tax',
  waste: 'Waste Management',
  other: 'Other Charges'
};

interface BillFormData {
  type: keyof typeof billTypes;
  amount: number;
  dueDate: string;
  description: string;
}

interface Bill {
  id: string;
  residentId: string;
  amount: number;
  dueDate: string;
  status: keyof typeof statusColors;
  type: keyof typeof billTypes;
  description: string;
  createdAt: string;
}

interface Resident {
  id: string;
  name: string;
  accountNumber: string;
  address: string;
  balance: number;
  lastBillDate: string;
  bills: Bill[];
}

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

const BillForm = ({ 
  onSubmit,
  resident,
}: { 
  onSubmit: (data: BillFormData) => void;
  resident: Resident;
}) => {
  const [formData, setFormData] = useState<BillFormData>({
    type: 'water',
    amount: 0,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: ''
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Bill Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: any) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(billTypes).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter bill description"
        />
      </div>

      <Button 
        className="w-full mt-4" 
        onClick={() => onSubmit(formData)}
      >
        Generate Bill
      </Button>
    </div>
  );
};

export default function ManageBillsPage() {
  const router = useRouter();
  const params = useParams();
  const residentId = params.residentId as string;
  const [resident, setResident] = useState<Resident | null>(null);
  const [activeTab, setActiveTab] = useState('bills');

  useEffect(() => {
    // In a real app, this would be an API call
    const foundResident = mockResidents.find(r => r.id === residentId);
    if (foundResident) {
      setResident(foundResident);
    }
  }, [residentId]);

  if (!resident) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600">Resident Not Found</h2>
          <p className="text-gray-600 mt-2">
            The requested resident could not be found.
          </p>
          <Button 
            className="mt-4"
            onClick={() => router.push('/billing')}
          >
            Return to Billing
          </Button>
        </Card>
      </div>
    );
  }

  const handleGenerateBill = (data: BillFormData) => {
    const newBill: Bill = {
      id: `BILL-${Math.random().toString(36).substr(2, 9)}`,
      residentId: resident.id,
      amount: data.amount,
      dueDate: new Date(data.dueDate).toISOString(),
      status: 'pending',
      type: data.type,
      description: data.description,
      createdAt: new Date().toISOString()
    };

    const updatedResident = {
      ...resident,
      balance: resident.balance + data.amount,
      lastBillDate: new Date().toISOString(),
      bills: [...resident.bills, newBill]
    };

    setResident(updatedResident);
  };

  const handlePayment = (billId: string, amount: number) => {
    const updatedBills = resident.bills.map(bill =>
      bill.id === billId ? { ...bill, status: 'paid' as const } : bill
    );

    setResident({
      ...resident,
      balance: resident.balance - amount,
      bills: updatedBills
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/billing')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Billing</span>
        </Button>
        <div className="border-l h-6" />
        <div>
          <h1 className="text-2xl font-bold">{resident.name}</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{resident.accountNumber}</span>
            <span>•</span>
            <span>{resident.address}</span>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
            <TabsTrigger value="generate">Generate Bill</TabsTrigger>
          </TabsList>

          <TabsContent value="bills" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Current Balance</h3>
                  <p className={`text-2xl font-bold ${resident.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${resident.balance.toFixed(2)}
                  </p>
                </div>
                <Button variant="outline" className="space-x-2">
                  <History size={16} />
                  <span>Payment History</span>
                </Button>
              </div>

              <div className="space-y-4">
                {resident.bills.map((bill) => (
                  <Card key={bill.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{billTypes[bill.type]}</span>
                          <Badge variant="outline">{bill.id}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{bill.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-lg font-semibold">${bill.amount.toFixed(2)}</span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[bill.status]
                            }`}
                          >
                            {bill.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {bill.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handlePayment(bill.id, bill.amount)}
                          >
                            Record Payment
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Send Reminder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Due: {new Date(bill.dueDate).toLocaleDateString()}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="generate">
            <BillForm resident={resident} onSubmit={handleGenerateBill} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}