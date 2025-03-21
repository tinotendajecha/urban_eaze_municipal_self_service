"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Download, FileSpreadsheet, FileText, Filter } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/export-util";

const monthlyData = [
  { month: "Jan", revenue: 65000, expenses: 45000, profit: 20000 },
  { month: "Feb", revenue: 59000, expenses: 42000, profit: 17000 },
  { month: "Mar", revenue: 80000, expenses: 52000, profit: 28000 },
  { month: "Apr", revenue: 81000, expenses: 55000, profit: 26000 },
  { month: "May", revenue: 56000, expenses: 42000, profit: 14000 },
  { month: "Jun", revenue: 55000, expenses: 41000, profit: 14000 },
];

const expenseBreakdown = [
  { name: "Infrastructure", value: 35 },
  { name: "Salaries", value: 25 },
  { name: "Services", value: 20 },
  { name: "Utilities", value: 15 },
  { name: "Other", value: 5 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const revenueStreams = [
  { name: "Property Tax", value: 45 },
  { name: "Utility Bills", value: 25 },
  { name: "Service Fees", value: 15 },
  { name: "Permits", value: 10 },
  { name: "Other", value: 5 },
];

const stats = [
  { label: "Total Revenue YTD", value: "$396,000" },
  { label: "Total Expenses YTD", value: "$277,000" },
  { label: "Net Profit YTD", value: "$119,000" },
  { label: "Budget Variance", value: "+5.2%" },
];

export default function FinancialsPage() {
  const handleExportPDF = () => {
    // Format monthly data for PDF
    const monthlyReportData = monthlyData.map(item => ({
      Month: item.month,
      Revenue: `$${item.revenue.toLocaleString()}`,
      Expenses: `$${item.expenses.toLocaleString()}`,
      Profit: `$${item.profit.toLocaleString()}`
    }));

    // Format expense breakdown for PDF
    const expenseReportData = expenseBreakdown.map(item => ({
      Category: item.name,
      Percentage: `${item.value}%`,
      EstimatedAmount: `$${((item.value / 100) * 277000).toLocaleString()}`
    }));

    // Format revenue streams for PDF
    const revenueReportData = revenueStreams.map(item => ({
      Source: item.name,
      Percentage: `${item.value}%`,
      EstimatedAmount: `$${((item.value / 100) * 396000).toLocaleString()}`
    }));

    // Create combined report
    const reportData = {
      summary: stats.map(item => ({
        Metric: item.label,
        Value: item.value
      })),
      monthlyData: monthlyReportData,
      expenseBreakdown: expenseReportData,
      revenueStreams: revenueReportData
    };

    // Export each section
    exportToPDF(reportData.summary, 'Financial Summary', ['Metric', 'Value']);
    exportToPDF(reportData.monthlyData, 'Monthly Financial Data', ['Month', 'Revenue', 'Expenses', 'Profit']);
    exportToPDF(reportData.expenseBreakdown, 'Expense Breakdown', ['Category', 'Percentage', 'EstimatedAmount']);
    exportToPDF(reportData.revenueStreams, 'Revenue Streams', ['Source', 'Percentage', 'EstimatedAmount']);
  };

  const handleExportExcel = () => {
    // Create workbook with multiple sheets
    const workbookData = {
      'Summary': stats.map(item => ({
        Metric: item.label,
        Value: item.value
      })),
      'Monthly Data': monthlyData.map(item => ({
        Month: item.month,
        Revenue: item.revenue,
        Expenses: item.expenses,
        Profit: item.profit
      })),
      'Expense Breakdown': expenseBreakdown.map(item => ({
        Category: item.name,
        Percentage: item.value,
        EstimatedAmount: (item.value / 100) * 277000
      })),
      'Revenue Streams': revenueStreams.map(item => ({
        Source: item.name,
        Percentage: item.value,
        EstimatedAmount: (item.value / 100) * 396000
      }))
    };

    exportToExcel(workbookData, 'Municipal Financials Report');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Municipal Financials</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-2))" name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-3))" name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Revenue Streams</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueStreams}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {revenueStreams.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}