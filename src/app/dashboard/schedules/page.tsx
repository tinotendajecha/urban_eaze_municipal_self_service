"use client";

import { useState } from "react";
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
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  AlertCircle,
  CalendarClock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ServiceSchedule {
  id: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  frequency: 'one_time' | 'weekly' | 'monthly' | 'quarterly';
}

const mockSchedules: ServiceSchedule[] = [
  {
    id: "1",
    service: "Waste Collection",
    date: "2025-03-20",
    time: "08:00",
    location: "Residential Area A",
    status: "scheduled",
    description: "Regular waste collection service",
    frequency: "weekly"
  },
  {
    id: "2",
    service: "Street Cleaning",
    date: "2025-03-22",
    time: "07:30",
    location: "Downtown District",
    status: "scheduled",
    description: "Monthly street cleaning service",
    frequency: "monthly"
  },
  {
    id: "3",
    service: "Park Maintenance",
    date: "2025-03-25",
    time: "09:00",
    location: "Central Park",
    status: "scheduled",
    description: "Quarterly park maintenance",
    frequency: "quarterly"
  }
];

const serviceTypes = [
  "Waste Collection",
  "Street Cleaning",
  "Park Maintenance",
  "Water Maintenance",
  "Road Work",
  "Tree Trimming"
];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<ServiceSchedule[]>(mockSchedules);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('all');

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch = 
      schedule.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = filterService === 'all' || schedule.service === filterService;
    return matchesSearch && matchesService;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'bg-purple-100 text-purple-800';
      case 'monthly':
        return 'bg-blue-100 text-blue-800';
      case 'quarterly':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Service Schedules</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-green-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CalendarClock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-900">Next Service</h3>
              <p className="text-sm text-green-600">Waste Collection - Tomorrow 8:00 AM</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Service Hours</h3>
              <p className="text-sm text-gray-500">Mon-Fri: 7:00 AM - 6:00 PM</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-yellow-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium text-yellow-900">Service Alert</h3>
              <p className="text-sm text-yellow-600">Road work scheduled for next week</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              className="pl-10"
              placeholder="Search by service or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={filterService}
              onValueChange={setFilterService}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {serviceTypes.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.service}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(schedule.date).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 text-gray-500 ml-2" />
                      <span>{schedule.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{schedule.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyBadge(schedule.frequency)}`}>
                      {schedule.frequency.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                      {schedule.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>{schedule.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}