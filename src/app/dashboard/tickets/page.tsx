"use client";

import { useState } from "react";
import { 
  Ticket,
  Search,
  Filter,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  User,
  Calendar,
  Tag
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
} from "@/components/ui/tabs"; // Ensure this module exists or remove if not needed

// This will be replaced with actual data from your auth system
const user_role = 'MUNICIPAL_STAFF';

interface TicketComment {
  id: string;
  ticketId: string;
  author: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  location: string;
  assignedTo: string;
  reportedBy: string;
  dateReported: string;
  lastUpdated: string;
  comments: TicketComment[];
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Broken Street Light',
    description: 'Street light on Oak Avenue has been out for 3 days',
    priority: 'medium',
    status: 'open',
    category: 'Infrastructure',
    location: 'Oak Avenue & 5th Street',
    assignedTo: 'Jane Smith',
    reportedBy: 'John Resident',
    dateReported: '2025-03-20T10:30:00Z',
    lastUpdated: '2025-03-20T10:30:00Z',
    comments: [
      {
        id: 'CMT-001',
        ticketId: 'TKT-001',
        author: 'Jane Smith',
        content: 'Scheduled inspection for tomorrow morning',
        timestamp: '2025-03-20T14:30:00Z',
        isInternal: true
      }
    ]
  },
  {
    id: 'TKT-002',
    subject: 'Pothole Repair Needed',
    description: 'Large pothole causing traffic hazard',
    priority: 'high',
    status: 'in_progress',
    category: 'Roads',
    location: 'Main Street near City Hall',
    assignedTo: 'Mike Tech',
    reportedBy: 'Sarah Citizen',
    dateReported: '2025-03-19T15:45:00Z',
    lastUpdated: '2025-03-20T09:15:00Z',
    comments: [
      {
        id: 'CMT-002',
        ticketId: 'TKT-002',
        author: 'Mike Tech',
        content: 'Road crew dispatched',
        timestamp: '2025-03-20T09:15:00Z',
        isInternal: false
      }
    ]
  }
];

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const statusColors = {
  open: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

interface TicketDetailsProps {
  ticket: Ticket;
  onUpdate: (updatedTicket: Ticket) => void;
}

const TicketDetails = ({ ticket, onUpdate }: TicketDetailsProps) => {
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    onUpdate({
      ...ticket,
      status: newStatus as Ticket['status'],
      lastUpdated: new Date().toISOString()
    });
  };

  const handleAssigneeChange = (newAssignee: string) => {
    onUpdate({
      ...ticket,
      assignedTo: newAssignee,
      lastUpdated: new Date().toISOString()
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: TicketComment = {
      id: `CMT-${Math.random().toString(36).substr(2, 9)}`,
      ticketId: ticket.id,
      author: 'Current User', // Replace with actual user name
      content: newComment,
      timestamp: new Date().toISOString(),
      isInternal
    };

    onUpdate({
      ...ticket,
      comments: [...ticket.comments, comment],
      lastUpdated: new Date().toISOString()
    });

    setNewComment('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Status</Label>
          <Select
            value={ticket.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Assigned To</Label>
          <Select
            value={ticket.assignedTo}
            onValueChange={handleAssigneeChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
              <SelectItem value="Mike Tech">Mike Tech</SelectItem>
              <SelectItem value="Sarah Handler">Sarah Handler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          {ticket.description}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Comments</Label>
          <div className="flex items-center space-x-2">
            <Label className="text-sm">Internal Only</Label>
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded border-gray-300"
            />
          </div>
        </div>
        <div className="space-y-4">
          {ticket.comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-md ${
                comment.isInternal ? 'bg-yellow-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>{comment.author}</span>
                <span>{new Date(comment.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm">{comment.content}</p>
              {comment.isInternal && (
                <Badge variant="outline" className="mt-2">Internal Note</Badge>
              )}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Textarea
            value={newComment}
            onChange={(e:any) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button onClick={handleAddComment}>Add</Button>
        </div>
      </div>
    </div>
  );
};

export default function TicketManagementPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Ticket>('dateReported');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

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

  const handleSort = (field: keyof Ticket) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredTickets = tickets
    .filter((ticket) => {
      const matchesSearch = 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aValue < bValue ? -direction : direction;
    });

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(tickets.map((ticket) =>
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    ));
    setSelectedTicket(updatedTicket);
  };

  const SortIcon = ({ field }: { field: keyof Ticket }) => (
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    Ticket ID
                    <SortIcon field="id" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('subject')}
                >
                  <div className="flex items-center">
                    Subject
                    <SortIcon field="subject" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center">
                    Priority
                    <SortIcon field="priority" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('assignedTo')}
                >
                  <div className="flex items-center">
                    Assigned To
                    <SortIcon field="assignedTo" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('dateReported')}
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
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b">
                  <td className="py-3 px-4">{ticket.id}</td>
                  <td className="py-3 px-4">{ticket.subject}</td>
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
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">{ticket.assignedTo}</td>
                  <td className="py-3 px-4">
                    {new Date(ticket.dateReported).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <span>{ticket.id}</span>
                            <span className="text-gray-400">|</span>
                            <span>{ticket.subject}</span>
                          </DialogTitle>
                          <DialogDescription>
                            Reported by {ticket.reportedBy} on{' '}
                            {new Date(ticket.dateReported).toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        <TicketDetails
                          ticket={ticket}
                          onUpdate={handleUpdateTicket}
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