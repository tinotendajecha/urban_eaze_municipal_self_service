"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface PermitFormData {
    userId: string,
    permitType: string;
  description: string;
  location: string;
  submissionDate: string;
  duration: string;
  status: string
//   attachments: FileList | null;
}

export default function ApplyPermitPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const router = useRouter();
    const [formData, setFormData] = useState<PermitFormData>({
        userId: userId || "06f42895-64b1-4fe2-a903-06668e94265b",  // Replace this with the actual user ID
        permitType: "",
        description: "",
        location: "",
        submissionDate: "",
        duration: "",
        status: "PENDING"
    // attachments: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically submit the form data to your backend
    console.log("Submitting permit application:", formData);

    const response = await fetch('/api/permits/add', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })

    if (!response.ok){
        toast.error("Error submitting permit application!");
        return;
    }

    const data = await response.json();
    console.log(data);

    // Show a success toast notification
    toast.success("Permit application submitted successfully!");
    
    // Redirect back to the permits list
    router.push("/dashboard/permits");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Permit Application</h1>
        <p className="text-gray-500 mt-2">
          Please fill out all required information for your permit application.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 ">
            <Label htmlFor="type">Permit Type</Label>
            <Select
              value={formData.permitType}
              onValueChange={(value) => setFormData({ ...formData, permitType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select permit type" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white">
                <SelectItem value="BUILDING">Building Permit</SelectItem>
                <SelectItem value="BUSINESS">Business License</SelectItem>
                <SelectItem value="EVENT">Event Permit</SelectItem>
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
                value={formData.submissionDate}
                onChange={(e) =>
                  setFormData({ ...formData, submissionDate: e.target.value })
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

          {/* <div className="space-y-2">
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
          </div> */}

          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1 bg-black text-white">
              Submit Application
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/permits")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}