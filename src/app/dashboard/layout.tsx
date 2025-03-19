'use client'
import React, { useState } from 'react';
import { 
  Users, Ticket, Receipt, PieChart, CreditCard, FileText, 
  FileSpreadsheet, Stamp, Calendar, History, Settings, LogOut,
  Menu, X, Bell, Search, Sun, Moon, ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { useSession } from 'next-auth/react';
// import { useTheme } from '../hooks/useTheme';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  adminOnly?: boolean;
}

const navigation: NavItem[] = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard/', adminOnly: true }  ,
  { icon: <Users size={20} />, label: 'Manage Users', href: '/dashboard/manage-users', adminOnly: true },
  { icon: <Ticket size={20} />, label: 'Manage Tickets', href: '/dashboard/tickets', adminOnly: true },
  { icon: <Receipt size={20} />, label: 'Bill Residents', href: '/dashboard/billing', adminOnly: true },
  { icon: <PieChart size={20} />, label: 'Municipal Financials', href: '/dashboard/financials', adminOnly: true },
  { icon: <CreditCard size={20} />, label: 'Make Bill Payment', href: '/dashboard/pay' },
  { icon: <FileText size={20} />, label: 'Open Ticket', href: '/dashboard/new-ticket' },
  { icon: <FileSpreadsheet size={20} />, label: 'Financial Statement', href: '/dashboard/statement' },
  { icon: <Stamp size={20} />, label: 'Apply for Permits', href: '/dashboard/permits' },
  { icon: <Calendar size={20} />, label: 'Service Schedules', href: '/dashboard/schedules' },
  { icon: <History size={20} />, label: 'Payment History', href: '/dashboard/history' },
  // { icon: <Settings size={20} />, label: 'Account Settings', href: '/dashboard/settings' },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const {data: session} = useSession()
//   const { isDark, toggleTheme } = useTheme();
  
  // Mock user data - replace with actual user data in production
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=48&h=48&q=80',
    role: 'admin'
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              UrbanEase
            </span>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              (!item.adminOnly || user.role === 'admin') && (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className="text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.label}</span>
                </a>
              )
            ))}
            
            <button
              onClick={() => {/* Handle logout */}}
              className="flex w-full items-center px-3 py-2 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="text-gray-500 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                <LogOut size={20} />
              </span>
              <span className="ml-3">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`lg:ml-64 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-200 mr-4"
              >
                <Menu size={24} />
              </button>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              {/* <button
                onClick={toggleTheme}
                className="text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button> */}

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={"user.avatar"}
                    alt={session?.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:block text-sm text-gray-700 dark:text-white">
                    {session?.user.username}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}