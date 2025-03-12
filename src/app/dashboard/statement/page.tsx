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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileSpreadsheet, FileText, Filter } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: string;
  amount: number;
  status: string;
  reference: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-03-15",
    description: "Water Bill Payment",
    type: "payment",
    amount: 85.50,
    status: "completed",
    reference: "WTR-2025-001"
  },
  {
    id: "2",
    date: "2025-03-01",
    description: "Property Tax Q1",
    type: "charge",
    amount: 750.00,
    status: "pending",
    reference: "PTX-2025-Q1"
  },
  {
    id: "3",
    date: "2025-02-15",
    description: "Waste Management Fee",
    type: "payment",
    amount: 45.00,
    status: "completed",
    reference: "WST-2025-002"
  }
];

export default function StatementPage() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [transactionType, setTransactionType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = transactionType === "all" || transaction.type === transactionType;
    return matchesSearch && matchesType;
  });

  const totalCharges = filteredTransactions
    .filter(t => t.type === "charge")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayments = filteredTransactions
    .filter(t => t.type === "payment")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCharges - totalPayments;

  const handleExportPDF = () => {
    const columns = ['date', 'reference', 'type', 'amount', 'method', 'status', 'description'];
    exportToPDF(filteredTransactions, 'Statement', columns);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredTransactions, 'Statement');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Financial Statement</h1>
        
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Charges</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">
            ${totalCharges.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Payments</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            ${totalPayments.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
          <p className={`mt-2 text-3xl font-semibold ${balance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${Math.abs(balance).toFixed(2)}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>Date Range</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label>Transaction Type</Label>
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All Transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="charge">Charges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Search</Label>
              <Input
                className="mt-2"
                placeholder="Search by description or reference..."
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
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.reference}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'payment'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'}>
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
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