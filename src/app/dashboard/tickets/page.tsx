"use client";

import { exportToPDF, exportToExcel } from "@/lib/export-utils";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { 
  Search,
  ChevronUp,
  ChevronDown
} from "lucide-react";
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
import Link from "next/link";
import { useSession } from "next-auth/react";

// This will be replaced with actual data from your auth system
const user_role = "MUNICIPAL_STAFF";

interface Ticket {
  id: string;
  description: string;
  ticketId: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  type: string;
  location: string;
  assignedTo: string;
  reportedBy: string;
  dateReported: string;
  lastUpdated: string;
  comments: string;
}

const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    ticketId: "TKT-001",
    description: "Street light on Oak Avenue has been out for 3 days",
    priority: "medium",
    status: "open",
    type: "Infrastructure",
    location: "Oak Avenue & 5th Street",
    assignedTo: "Jane Smith",
    reportedBy: "John Resident",
    dateReported: "2025-03-20T10:30:00Z",
    lastUpdated: "2025-03-20T10:30:00Z",
    comments: ""
  },
  {
    id: "TKT-002",
    ticketId: "TKT-001",
    description: "Large pothole causing traffic hazard",
    priority: "high",
    status: "in_progress",
    type: "Roads",
    location: "Main Street near City Hall",
    assignedTo: "Mike Tech",
    reportedBy: "Sarah Citizen",
    dateReported: "2025-03-19T15:45:00Z",
    lastUpdated: "2025-03-20T09:15:00Z",
    comments: ""
  },
];

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const statusColors = {
  open: "bg-purple-100 text-purple-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

export default function TicketManagementPage() {
  const {data: session} = useSession();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Ticket>('dateReported');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  if (user_role !== "MUNICIPAL_STAFF") {
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

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch("/api/service-requests/all", {
        method: "GET",
      });
      const data = await response.json();
      setTickets(data.serviceRequests);

      console.log("tickets: ", data.serviceRequests);
    };
    fetchTickets();
  }, []);

  const handleSort = (field: keyof Ticket) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // const filteredTickets = tickets
  //   .filter((ticket) => {
  //     const matchesSearch =
  //       ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       ticket.location.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesStatus =
  //       statusFilter === "all" || ticket.status === statusFilter;
  //     const matchesPriority =
  //       priorityFilter === "all" || ticket.priority === priorityFilter;

  //     return matchesSearch && matchesStatus && matchesPriority;
  //   })
  //   .sort((a, b) => {
  //     const aValue = a[sortField];
  //     const bValue = b[sortField];
  //     const direction = sortDirection === "asc" ? 1 : -1;
  //     return aValue < bValue ? -direction : direction;
  //   });

  const SortIcon = ({ field }: { field: keyof Ticket }) => (
    <span className="ml-2">
      {sortField === field ? (
        sortDirection === "asc" ? (
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
    const columns = [
      "date",
      "reference",
      "type",
      "amount",
      "method",
      "status",
      "description",
    ];
    exportToPDF(tickets, "Tickets", columns);
  };

  const handleExportExcel = () => {
    exportToExcel(tickets, "Tickets");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>

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
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              className="pl-10"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    Ticket ID
                    <SortIcon field="id" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("priority")}
                >
                  <div className="flex items-center">
                    Priority
                    <SortIcon field="priority" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("assignedTo")}
                >
                  <div className="flex items-center">
                    Assigned To
                    <SortIcon field="assignedTo" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("dateReported")}
                >
                  <div className="flex items-center">
                    Date Reported
                    <SortIcon field="dateReported" />
                  </div>
                </th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets && tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b">
                  <td className="py-3 px-4">{ticket.ticketId}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        priorityColors[ticket.priority]
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[ticket.status]
                      }`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4">{ticket.assignedTo}</td>
                  <td className="py-3 px-4">
                    {new Date(ticket.dateReported).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/dashboard/tickets/manage/${ticket.ticketId}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
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
