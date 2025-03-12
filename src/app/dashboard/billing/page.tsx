"use client";

import { useState } from "react";
import { 
  Search,
  DollarSign,
  FileText,
  Mail,
  Calendar,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  History,
  Download,
  Send
} from "lucide-react";

import { FileSpreadsheet, Filter } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// This will be replaced with actual data from your auth system
const user_role = 'MUNICIPAL_STAFF';

interface Bill {
  id: string;
  residentId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  type: 'water' | 'property_tax' | 'waste' | 'other';
  description: string;
  createdAt: string;
}

interface Resident {
  id: string;
  name: string;
  email: string;
  address: string;
  accountNumber: string;
  balance: number;
  lastBillDate: string;
  bills: Bill[];
}

const mockResidents: Resident[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Oak Street',
    accountNumber: 'ACC-001',
    balance: 245.00,
    lastBillDate: '2025-03-01T10:00:00Z',
    bills: [
      {
        id: 'BILL-001',
        residentId: '1',
        amount: 85.00,
        dueDate: '2025-04-01T00:00:00Z',
        status: 'pending',
        type: 'water',
        description: 'March 2025 Water Bill',
        createdAt: '2025-03-01T10:00:00Z'
      },
      {
        id: 'BILL-002',
        residentId: '1',
        amount: 160.00,
        dueDate: '2025-03-15T00:00:00Z',
        status: 'paid',
        type: 'property_tax',
        description: 'Q1 2025 Property Tax',
        createdAt: '2025-02-15T10:00:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    address: '456 Maple Avenue',
    accountNumber: 'ACC-002',
    balance: 350.00,
    lastBillDate: '2025-03-05T14:30:00Z',
    bills: [
      {
        id: 'BILL-003',
        residentId: '2',
        amount: 95.00,
        dueDate: '2025-04-05T00:00:00Z',
        status: 'pending',
        type: 'water',
        description: 'March 2025 Water Bill',
        createdAt: '2025-03-05T14:30:00Z'
      }
    ]
  }
];

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

interface ResidentDetailsProps {
  resident: Resident;
  onUpdate: (updatedResident: Resident) => void;
}

const ResidentDetails = ({ resident, onUpdate }: ResidentDetailsProps) => {
  const [activeTab, setActiveTab] = useState('bills');

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

    onUpdate({
      ...resident,
      balance: resident.balance + data.amount,
      lastBillDate: new Date().toISOString(),
      bills: [...resident.bills, newBill]
    });
  };

  const handlePayment = (billId: string, amount: number) => {
    const updatedBills = resident.bills.map(bill =>
      bill.id === billId ? { ...bill, status: 'paid' as const } : bill
    );

    onUpdate({
      ...resident,
      balance: resident.balance - amount,
      bills: updatedBills
    });
  };

  return (
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
  );
};

export default function BillResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Resident>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  if (user_role !== 'MUNICIPAL_STAFF') {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">
            You do not have permission to access this page.
          </p>
        </Card>
      </div>
    );
  }

  const handleSort = (field: keyof Resident) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredResidents = residents
    .filter((resident) =>
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aValue < bValue ? -direction : direction;
    });

  const handleUpdateResident = (updatedResident: Resident) => {
    setResidents(residents.map((resident) =>
      resident.id === updatedResident.id ? updatedResident : resident
    ));
    setSelectedResident(updatedResident);
  };

  const SortIcon = ({ field }: { field: keyof Resident }) => (
    <span className="ml-2">
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )
      ) : (
        <ChevronUp size={16} className="text-gray-300" />
      )}
    </span>
  );

  const handleExportPDF = () => {
    const columns = ['date', 'reference', 'type', 'amount', 'method', 'status', 'description'];
    exportToPDF(filteredResidents, 'Bill residents', columns);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredResidents, 'Bill residents');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bill Residents</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              className="pl-10"
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('accountNumber')}
                >
                  <div className="flex items-center">
                    Account #
                    <SortIcon field="accountNumber" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('balance')}
                >
                  <div className="flex items-center">
                    Balance
                    <SortIcon field="balance" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('lastBillDate')}
                >
                  <div className="flex items-center">
                    Last Bill Date
                    <SortIcon field="lastBillDate" />
                  </div>
                </th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.map((resident) => (
                <tr key={resident.id} className="border-b">
                  <td className="py-3 px-4">{resident.accountNumber}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div>{resident.name}</div>
                      <div className="text-sm text-gray-500">{resident.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={resident.balance > 0 ? 'text-red-600' : 'text-green-600'}>
                      ${resident.balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(resident.lastBillDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Manage Bills
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <span>{resident.name}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500">{resident.accountNumber}</span>
                          </DialogTitle>
                          <DialogDescription>
                            {resident.address}
                          </DialogDescription>
                        </DialogHeader>
                        <ResidentDetails
                          resident={resident}
                          onUpdate={handleUpdateResident}
                        />
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}