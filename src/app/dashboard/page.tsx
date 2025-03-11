"use client";

import { useState } from "react";
import { 
  LineChart, 
  BarChart, 
  Activity, 
  Users, 
  Clock, 
  Bell,
  FileText,
  Calendar,
  Home,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";

// This will be replaced with actual data from your auth system
const user_role: 'ADMIN' | 'MUNICIPAL_STAFF' | 'RESIDENT' = 'RESIDENT';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <Card className="p-6 space-y-2">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="text-purple-500">{icon}</div>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Card>
);

interface ActivityItemProps {
  title: string;
  time: string;
  description: string;
  icon: React.ReactNode;
}

const ActivityItem = ({ title, time, description, icon }: ActivityItemProps) => (
  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
    <div className="text-purple-500">{icon}</div>
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const AdminDashboard = () => (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="1,234"
          icon={<Users size={20} />}
          description="12% increase from last month"
        />
        <StatCard
          title="Active Services"
          value="856"
          icon={<Activity size={20} />}
          description="24 new services this week"
        />
        <StatCard
          title="Pending Approvals"
          value="28"
          icon={<Clock size={20} />}
          description="5 require immediate attention"
        />
        <StatCard
          title="System Health"
          value="98.9%"
          icon={<LineChart size={20} />}
          description="Optimal performance"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <ActivityItem
              title="New User Registration"
              time="2 hours ago"
              description="John Doe completed registration process"
              icon={<Users size={18} />}
            />
            <ActivityItem
              title="Service Request"
              time="4 hours ago"
              description="Maintenance request submitted for Park Avenue"
              icon={<FileText size={18} />}
            />
            <ActivityItem
              title="System Update"
              time="6 hours ago"
              description="Security patches successfully installed"
              icon={<Activity size={18} />}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Analytics</h3>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart placeholder
          </div>
        </Card>
      </div>
    </div>
  );

  const MunicipalStaffDashboard = () => (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Active Tasks"
          value="12"
          icon={<FileText size={20} />}
          description="4 due today"
        />
        <StatCard
          title="Scheduled Events"
          value="8"
          icon={<Calendar size={20} />}
          description="Next event in 2 hours"
        />
        <StatCard
          title="Service Requests"
          value="24"
          icon={<Bell size={20} />}
          description="6 new requests"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            <ActivityItem
              title="Team Meeting"
              time="10:00 AM"
              description="Weekly progress review"
              icon={<Users size={18} />}
            />
            <ActivityItem
              title="Site Inspection"
              time="2:00 PM"
              description="Main Street Construction"
              icon={<Home size={18} />}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Urgent Requests</h3>
          <div className="space-y-4">
            <ActivityItem
              title="Water Main Break"
              time="1 hour ago"
              description="Emergency repair needed on Oak Street"
              icon={<AlertCircle size={18} />}
            />
            <ActivityItem
              title="Traffic Signal Malfunction"
              time="2 hours ago"
              description="Intersection of Main and First"
              icon={<AlertCircle size={18} />}
            />
          </div>
        </Card>
      </div>
    </div>
  );

  const ResidentDashboard = () => (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Current Balance"
          value="$245.00"
          icon={<BarChart size={20} />}
          description="Due in 15 days"
        />
        <StatCard
          title="Active Services"
          value="3"
          icon={<Activity size={20} />}
          description="All services active"
        />
        <StatCard
          title="Notifications"
          value="4"
          icon={<Bell size={20} />}
          description="2 new updates"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bills</h3>
          <div className="space-y-4">
            <ActivityItem
              title="Water Bill"
              time="March 2025"
              description="$85.00 - Due in 15 days"
              icon={<FileText size={18} />}
            />
            <ActivityItem
              title="Property Tax"
              time="Q1 2025"
              description="$160.00 - Paid"
              icon={<FileText size={18} />}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Community Updates</h3>
          <div className="space-y-4">
            <ActivityItem
              title="Road Maintenance"
              time="Next Week"
              description="Scheduled maintenance on Oak Street"
              icon={<Bell size={18} />}
            />
            <ActivityItem
              title="Community Event"
              time="This Weekend"
              description="Spring Festival at Central Park"
              icon={<Calendar size={18} />}
            />
          </div>
        </Card>
      </div>
    </div>
  );

  const renderDashboard = () => {
    switch (user_role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'MUNICIPAL_STAFF':
        return <MunicipalStaffDashboard />;
      case 'RESIDENT':
        return <ResidentDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      {renderDashboard()}
    </div>
  );
}