"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileSpreadsheet, FileText, Filter } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";

interface Payment {
  id: string;
  date: string;
  amount: number;
  type: string;
  method: string;
  status: string;
  reference: string;
  description: string;
}

const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    date: "2025-03-15",
    amount: 85.50,
    type: "Water Bill",
    method: "Credit Card",
    status: "completed",
    reference: "WTR-2025-001",
    description: "March 2025 Water Bill Payment"
  },
  {
    id: "PAY-002",
    date: "2025-03-01",
    amount: 750.00,
    type: "Property Tax",
    method: "Bank Transfer",
    status: "completed",
    reference: "PTX-2025-Q1",
    description: "Q1 2025 Property Tax Payment"
  },
  {
    id: "PAY-003",
    date: "2025-02-15",
    amount: 45.00,
    type: "Waste Management",
    method: "Direct Debit",
    status: "completed",
    reference: "WST-2025-002",
    description: "February 2025 Waste Management Fee"
  }
];

export default function PaymentHistoryPage() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [paymentType, setPaymentType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = 
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = paymentType === "all" || payment.type.toLowerCase().includes(paymentType.toLowerCase());
    return matchesSearch && matchesType;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  const handleExportPDF = () => {
    const columns = ['date', 'reference', 'type', 'amount', 'method', 'status', 'description'];
    exportToPDF(filteredPayments, 'Payment History', columns);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredPayments, 'Payment History');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Total Payments</h2>
          <p className="text-3xl font-bold text-green-600">
            ${totalAmount.toFixed(2)}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  placeholder="Start Date"
                />
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  placeholder="End Date"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select
                value={paymentType}
                onValueChange={setPaymentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Payment Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="water">Water Bill</SelectItem>
                  <SelectItem value="property">Property Tax</SelectItem>
                  <SelectItem value="waste">Waste Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                placeholder="Search by reference or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.reference}</TableCell>
                    <TableCell>{payment.type}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600">
                        ${payment.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}