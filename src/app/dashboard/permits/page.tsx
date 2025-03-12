"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { Download, FileSpreadsheet, FileText, Filter } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";

interface Permit {
  id: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "in_review";
  submissionDate: string;
  description: string;
  location: string;
  applicant: string;
}

const mockPermits: Permit[] = [
  {
    id: "1",
    type: "Building",
    status: "pending",
    submissionDate: "2025-03-15",
    description: "New garage construction",
    location: "123 Main St",
    applicant: "John Smith",
  },
  {
    id: "2",
    type: "Business",
    status: "approved",
    submissionDate: "2025-03-10",
    description: "Restaurant license",
    location: "456 Market St",
    applicant: "Sarah Johnson",
  },
  {
    id: "3",
    type: "Event",
    status: "in_review",
    submissionDate: "2025-03-01",
    description: "Community festival",
    location: "Central Park",
    applicant: "Community Center",
  },
];

interface PermitFormData {
  type: string;
  description: string;
  location: string;
  startDate: string;
  duration: string;
  attachments: FileList | null;
}

const PermitForm = ({
  onSubmit,
}: {
  onSubmit: (data: PermitFormData) => void;
}) => {
  const [formData, setFormData] = useState<PermitFormData>({
    type: "",
    description: "",
    location: "",
    startDate: "",
    duration: "",
    attachments: null,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Permit Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select permit type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="building">Building Permit</SelectItem>
            <SelectItem value="business">Business License</SelectItem>
            <SelectItem value="event">Event Permit</SelectItem>
            <SelectItem value="renovation">Renovation Permit</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Detailed description of the permit request"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Address or location details"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            placeholder="e.g., 6 months"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachments">Required Documents</Label>
        <Input
          id="attachments"
          type="file"
          multiple
          onChange={(e) =>
            setFormData({ ...formData, attachments: e.target.files })
          }
        />
        <p className="text-sm text-gray-500">
          Upload all required documentation (plans, certificates, etc.)
        </p>
      </div>

      <Button className="w-full mt-4" onClick={() => onSubmit(formData)}>
        Submit Application
      </Button>
    </div>
  );
};

export default function PermitsPage() {
  const [permits, setPermits] = useState<Permit[]>(mockPermits);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPermits = permits.filter(
    (permit) =>
      permit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.applicant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitPermit = (data: PermitFormData) => {
    const newPermit: Permit = {
      id: Math.random().toString(36).substr(2, 9),
      type: data.type,
      status: "pending",
      submissionDate: new Date().toISOString().split("T")[0],
      description: data.description,
      location: data.location,
      applicant: "Current User", // This would come from auth context
    };
    setPermits([...permits, newPermit]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

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
    exportToPDF(filteredPermits, "Permits", columns);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredPermits, "Permits");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Apply for Permits</h1>

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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Permit Application</DialogTitle>
              <DialogDescription>
                Submit a new permit application. Please ensure you have all
                required documentation ready.
              </DialogDescription>
            </DialogHeader>
            <PermitForm onSubmit={handleSubmitPermit} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              className="pl-10"
              placeholder="Search permits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermits.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell>{permit.type}</TableCell>
                  <TableCell>{permit.description}</TableCell>
                  <TableCell>{permit.location}</TableCell>
                  <TableCell>
                    {new Date(permit.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        permit.status
                      )}`}
                    >
                      {permit.status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
