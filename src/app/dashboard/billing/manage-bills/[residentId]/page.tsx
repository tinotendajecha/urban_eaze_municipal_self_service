"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  History,
  Download,
  Send,
  ArrowLeft,
  MoreHorizontal,
  Receipt,
  AlertCircle,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Plus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import Link from "next/link";

export type BillStatus = "pending" | "paid" | "overdue" | "cancelled";

interface Bill {
  id: string;
  residentId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  type: 'water' | 'property_tax' | 'waste' | 'streetlight' | 'other';
  description: string;
  createdAt: string;
  paidAt?: string;
  paymentMethod?: string;
  paymentReference?: string;
}

interface Resident {
  id: string;
  name: string;
  accountNumber: string;
  address: string;
  balance: number;
  lastBillDate: string;
  bills: Bill[];
  email: string;
  phone: string;
  propertyType: 'residential' | 'commercial';
}

// Mock data - replace with your actual data fetching logic
const mockResidents: Resident[] = [
  {
    id: "1",
    name: "John Doe",
    accountNumber: "ACC-001",
    address: "123 Main St",
    balance: 250.00,
    lastBillDate: "2024-03-15T00:00:00.000Z",
    bills: [
      {
        id: "BILL-001",
        residentId: "1",
        amount: 150.00,
        dueDate: "2024-04-15T00:00:00.000Z",
        status: "pending",
        type: "water",
        description: "March 2024 Water Bill",
        createdAt: "2024-03-15T00:00:00.000Z"
      },
      {
        id: "BILL-002",
        residentId: "1",
        amount: 100.00,
        dueDate: "2024-04-15T00:00:00.000Z",
        status: "paid",
        type: "waste",
        description: "Q1 2024 Waste Management",
        createdAt: "2024-03-01T00:00:00.000Z",
        paidAt: "2024-03-10T00:00:00.000Z",
        paymentMethod: "credit_card",
        paymentReference: "PAY-123456"
      }
    ],
    email: "john@example.com",
    phone: "+1234567890",
    propertyType: "residential"
  }
];

interface BillFormData {
  type: Bill['type'];
  amount: number;
  dueDate: string;
  description: string;
}

interface PaymentFormData {
  amount: number;
  method: string;
  reference: string;
  date: string;
  notes: string;
}

const BillForm = ({ onSubmit, initialData }: { 
  onSubmit: (data: BillFormData) => void;
  initialData?: Partial<BillFormData>;
}) => {
  const [formData, setFormData] = useState<BillFormData>({
    type: 'water',
    amount: initialData?.amount || 0,
    dueDate: initialData?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: initialData?.description || ''
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Bill Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: Bill['type']) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select bill type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-300">
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="property_tax">Property Tax</SelectItem>
            <SelectItem value="waste">Waste Management</SelectItem>
            <SelectItem value="streetlight">Street Lighting</SelectItem>
            <SelectItem value="other">Other</SelectItem>
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
        <Textarea
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
        {initialData ? 'Update Bill' : 'Generate Bill'}
      </Button>
    </div>
  );
};

const PaymentForm = ({ bill, onSubmit }: {
  bill: Bill;
  onSubmit: (data: PaymentFormData) => void;
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: bill.amount,
    method: 'credit_card',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Payment Amount ($)</Label>
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
        <Label htmlFor="method">Payment Method</Label>
        <Select
          value={formData.method}
          onValueChange={(value) => setFormData({ ...formData, method: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent className="bg-gray-300">
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="debit_card">Debit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Payment Reference</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          placeholder="Enter payment reference number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Payment Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional notes"
        />
      </div>

      <Button 
        className="w-full mt-4" 
        onClick={() => onSubmit(formData)}
      >
        Record Payment
      </Button>
    </div>
  );
};

export default function ManageBillsPage() {
  const router = useRouter();
  const params = useParams();
  const residentId = params.residentId as string;
  const [resident, setResident] = useState<Resident | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

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
            onClick={() => router.push('/dashboard/billing')}
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

  const handlePayment = (billId: string, paymentData: PaymentFormData) => {
    const updatedBills = resident.bills.map(bill =>
      bill.id === billId ? {
        ...bill,
        status: 'paid' as BillStatus,
        paidAt: paymentData.date,
        paymentMethod: paymentData.method,
        paymentReference: paymentData.reference
      } : bill
    );

    setResident({
      ...resident,
      balance: resident.balance - paymentData.amount,
      bills: updatedBills
    });

    setSelectedBill(null);
  };

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getBillTypeIcon = (type: Bill['type']) => {
    switch (type) {
      case 'water':
        return <Receipt className="h-5 w-5" />;
      case 'property_tax':
        return <DollarSign className="h-5 w-5" />;
      case 'waste':
        return <Receipt className="h-5 w-5" />;
      case 'streetlight':
        return <Receipt className="h-5 w-5" />;
      default:
        return <Receipt className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Current Balance</h3>
              <p className={`text-2xl font-semibold ${resident.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${Math.abs(resident.balance).toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium">Last Bill Date</h3>
              <p className="text-lg">
                {new Date(resident.lastBillDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Payment Status</h3>
              <p className="text-lg">
                {resident.balance > 0 ? 'Outstanding' : 'Up to Date'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">
                {activeTab === 'overview' && 'Account Overview'}
                {activeTab === 'bills' && 'Bills'}
                {activeTab === 'payments' && 'Payment History'}
                {activeTab === 'history' && 'Account History'}
              </h2>
              {activeTab === 'bills' && (
                    <Link href={'/dashboard/billing/manage-bills/1/bill'}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Bill
                    </Link>
              )}
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Resident Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span>{resident.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Account Number</span>
                      <span>{resident.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address</span>
                      <span>{resident.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Property Type</span>
                      <span className="capitalize">{resident.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span>{resident.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone</span>
                      <span>{resident.phone}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Billing Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Balance</span>
                      <span className={resident.balance > 0 ? 'text-red-600' : 'text-green-600'}>
                        ${Math.abs(resident.balance).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Payment</span>
                      <span>
                        {resident.bills.find(b => b.status === 'paid')?.paidAt
                          ? new Date(resident.bills.find(b => b.status === 'paid')!.paidAt!).toLocaleDateString()
                          : 'No payments'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        resident.balance > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {resident.balance > 0 ? 'Outstanding' : 'Up to Date'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {resident.balance > 0 && (
                <Card className="p-6 bg-yellow-50 border-yellow-200">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Outstanding Balance Notice</h4>
                      <p className="mt-1 text-sm text-yellow-700">
                        This account has an outstanding balance of ${resident.balance.toFixed(2)}.
                        Please ensure timely payment to avoid any service interruptions.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bills">
              <div className="space-y-4">
                {resident.bills.map((bill) => (
                  <Card key={bill.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {getBillTypeIcon(bill.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">
                              {bill.type.replace('_', ' ').charAt(0).toUpperCase() + bill.type.slice(1)}
                            </span>
                            <Badge variant="outline">{bill.id}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{bill.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-lg font-semibold">${bill.amount.toFixed(2)}</span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                getStatusColor(bill.status)
                              }`}
                            >
                              {bill.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {bill.status === 'pending' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                Record Payment
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Record Payment</DialogTitle>
                                <DialogDescription>
                                  Record a payment for bill {bill.id}
                                </DialogDescription>
                              </DialogHeader>
                              <PaymentForm
                                bill={bill}
                                onSubmit={(data) => handlePayment(bill.id, data)}
                              />
                            </DialogContent>
                          </Dialog>
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
                            {bill.status === 'pending' && (
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Bill
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <div className="space-y-4">
                {resident.bills
                  .filter(bill => bill.status === 'paid')
                  .map((bill) => (
                    <Card key={bill.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{bill.description}</span>
                            <Badge variant="outline">{bill.paymentReference}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-lg font-semibold text-green-600">
                              ${bill.amount.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500">
                              via {bill.paymentMethod?.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Paid: {new Date(bill.paidAt!).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                {resident.bills.map((bill) => (
                  <Card key={bill.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {bill.status === 'paid' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Receipt className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{bill.description}</span>
                            <Badge variant="outline">{bill.id}</Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(bill.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-lg font-semibold">${bill.amount.toFixed(2)}</span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getStatusColor(bill.status)
                            }`}
                          >
                            {bill.status}
                          </span>
                        </div>
                        {bill.status === 'paid' && (
                          <div className="mt-2 text-sm text-gray-500">
                            Paid on {new Date(bill.paidAt!).toLocaleDateString()} via {bill.paymentMethod}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}