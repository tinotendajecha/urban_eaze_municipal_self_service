"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MapPin, User, FileText, Calendar } from "lucide-react";

interface Permit {
  id: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "in_review";
  submissionDate: string;
  description: string;
  location: string;
  applicant: string;
}

// This would typically come from your API/database
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

export default function PermitDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [permit, setPermit] = useState<Permit | null>(null);

  useEffect(() => {
    // In a real application, this would be an API call
    const foundPermit = mockPermits.find((p) => p.id === params.id);
    setPermit(foundPermit || null);
  }, [params.id]);

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

  if (!permit) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/permits")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Permits
        </Button>
        <Card className="p-6">
          <p className="text-center text-gray-500">Permit not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/permits")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Permits
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{permit.type}</h1>
          <div className="mt-2 flex items-center space-x-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                permit.status
              )}`}
            >
              {permit.status.replace("_", " ")}
            </span>
            <span className="text-gray-500">ID: {permit.id}</span>
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Applicant</div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>{permit.applicant}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Submission Date</div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>
                  {new Date(permit.submissionDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Location</div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{permit.location}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Processing Time</div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>2-3 weeks</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{permit.description}</p>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold mb-2">Attached Documents</h2>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-500">No documents attached</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold mb-2">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="font-medium">Application Submitted</p>
                  <p className="text-sm text-gray-500">
                    {new Date(permit.submissionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="font-medium">Under Review</p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      new Date(permit.submissionDate).getTime() + 86400000
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}