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
import { Textarea } from "@/components/ui/textarea";
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

// Mock data - replace with your actual data fetching logic
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

export default function ManageTicketPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.ticketId as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    const foundTicket = mockTickets.find(t => t.id === ticketId);
    if (foundTicket) {
      setTicket(foundTicket);
    }
  }, [ticketId]);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600">Ticket Not Found</h2>
          <p className="text-gray-600 mt-2">
            The requested ticket could not be found.
          </p>
          <Button 
            className="mt-4"
            onClick={() => router.push('/tickets')}
          >
            Return to Tickets
          </Button>
        </Card>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    setTicket({
      ...ticket,
      status: newStatus as Ticket['status'],
      lastUpdated: new Date().toISOString()
    });
  };

  const handleAssigneeChange = (newAssignee: string) => {
    setTicket({
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

    setTicket({
      ...ticket,
      comments: [...ticket.comments, comment],
      lastUpdated: new Date().toISOString()
    });

    setNewComment('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/tickets')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Tickets</span>
        </Button>
        <div className="border-l h-6" />
        <div>
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{ticket.id}</span>
            <span>•</span>
            <span>{ticket.location}</span>
          </div>
        </div>
      </div>

      <Card className="p-6">
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

        <div className="mt-6 space-y-2">
          <Label>Description</Label>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            {ticket.description}
          </p>
        </div>

        <div className="mt-6 space-y-2">
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
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
            />
            <Button onClick={handleAddComment}>Add</Button>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal size={16} className="mr-2" />
                Actions
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
      </Card>
    </div>
  );
}