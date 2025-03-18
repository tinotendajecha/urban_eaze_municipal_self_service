"use client";

import { useEffect, useState } from "react";
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
import { AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface TicketFormData {
  description: string;
  userId: string;
  type: string;
  priority: string;
  location: string;
  attachments: FileList | null;
}

export default function NewTicketPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<TicketFormData>({
    description: "",
    userId: "",
    type: "",
    priority: "",
    location: "",
    attachments: null,
  });

  useEffect(() => {
    
  setFormData({ ...formData, userId: session?.user.id! });
  }, [session])
  


  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting ticket:", formData);

    const response = await fetch("/api/service-requests/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("data: ", data);

    if (response.status != 201) {
      toast.error("Something went wrong!");
      return;
    }

    toast.success("Ticket logged succesfully");

    // push to dashboard
    router.push("/dashboard/tickets");

    // Reset form or show success message
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Open New Ticket</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Ticket Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => {
                setFormData({ ...formData, type: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="utility">Utility Issue</SelectItem>
                <SelectItem value="noise">Noise Complaint</SelectItem>
                <SelectItem value="safety">Safety Concern</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Please provide detailed information about your issue"
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              onChange={(e) =>
                setFormData({ ...formData, attachments: e.target.files })
              }
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500">
              Upload relevant photos or documents (Max 5MB per file)
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <p className="ml-3 text-sm text-yellow-700">
                For emergencies requiring immediate attention, please call our
                emergency hotline at
                <strong className="ml-1">1-800-555-0123</strong>
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
