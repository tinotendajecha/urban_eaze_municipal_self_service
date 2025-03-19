"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, FileSpreadsheet, FileText, Trash, Trash2Icon } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";

interface Permit {
  id: string;
  permitType: string;
  status: "pending" | "approved" | "rejected" | "in_review";
  submissionDate: string;
  description: string;
  location: string;
  applicant: string;
}



export default function PermitsPage() {

  const router = useRouter();
  const [permits, setPermits] = useState<Permit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
      async function fetchPermits(){
        const response = await fetch('/api/permits/all')
  
        if (response.ok) {
          const data = await response.json()
          setPermits(data.permits)
        }
      }
  
      fetchPermits()
    }, [])


  const filteredPermits = permits?.filter(
    (permit) =>
      permit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.applicant.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold tracking-tight">Permits</h1>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={() => router.push("/dashboard/permits/apply")}>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>
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
                  <TableCell>{permit.permitType}</TableCell>
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
                      <Trash2Icon className="h-4 w-4 mr-2 text-red-500" />
                      Delete
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