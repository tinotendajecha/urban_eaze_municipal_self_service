"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  XCircle,
  ChevronUp,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";
import { Download, FileSpreadsheet, FileText, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "react-toastify";

// This will be replaced with actual data from your auth system
const user_role = 'ADMIN';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MUNICIPAL_STAFF' | 'RESIDENT';
  phone: string;
}

interface UserFormData {
  name: string;
  email: string;
  role: 'ADMIN' | 'MUNICIPAL_STAFF' | 'RESIDENT';
}

const UserForm = ({ onSubmit, initialData }: { 
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData;
}) => {
  const [formData, setFormData] = useState<UserFormData>(
    initialData || {
      name: '',
      email: '',
      role: 'RESIDENT',
    }
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e:any) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e:any) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: any) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-300">
            <SelectItem value="ADMIN">Administrator</SelectItem>
            <SelectItem value="MUNICIPAL_STAFF">Municipal Staff</SelectItem>
            <SelectItem value="RESIDENT">Resident</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button 
        className="w-full mt-4" 
        onClick={() => onSubmit(formData)}
      >
        {initialData ? 'Update User' : 'Create User'}
      </Button>
    </div>
  );
};

export default function ManageUsersPage() {

  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUsers(){
      const response = await fetch('/api/users/all')

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        // console.log(data)
      }
    }

    fetchUsers()
  }, [refresh])

  const [users, setUsers] = useState<User[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

 

  if (user_role !== 'ADMIN') {
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

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // const sortedUsers = [...users].sort((a, b) => {
  //   const aValue = a[sortField];
  //   const bValue = b[sortField];
  //   const direction = sortDirection === 'asc' ? 1 : -1;
  //   return aValue < bValue ? -direction : direction;
  // });

  // const filteredUsers = sortedUsers.filter(
  //   (user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleCreateUser = (data: UserFormData) => {
    // const newUser: User = {
    //   id: Math.random().toString(36).substr(2, 9),
    //   ...data,
    // };
    // setUsers([...users, newUser]);
  };

  const handleUpdateUser = (data: UserFormData) => {
    // if (!selectedUser) return;
    // const updatedUsers = users.map((user) =>
    //   user.id === selectedUser.id
    //     ? { ...user, ...data }
    //     : user
    // );
    // setUsers(updatedUsers);
    // setSelectedUser(null);
  };
  

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      const data = await response.json();

      if (response.ok){
        toast.success(data.message)
      }

      setRefresh(!refresh)
      
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handleToggleStatus = (userId: string) => {
    // setUsers(
    //   users.map((user) =>
    //     user.id === userId
    //       ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
    //       : user
    //   )
    // );
  };

  const SortIcon = ({ field }: { field: keyof User }) => (
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

    const handleExportPDF = () => {
      const columns = ['date', 'reference', 'type', 'amount', 'method', 'status', 'description'];
      // exportToPDF(users, 'Users', columns);
    };
  
    const handleExportExcel = () => {
      // exportToExcel(filteredUsers, 'Users');
    };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
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
            <Link href={'/auth/new-user'} className="flex align-middle items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Link>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              className="pl-10"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e:any) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    <SortIcon field="email" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center">
                    Role
                    <SortIcon field="role" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer"
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center">
                    Phone
                    <SortIcon field="phone" />
                  </div>
                </th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e:any) => e.preventDefault()}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                              <DialogDescription>
                                Update user information and role.
                              </DialogDescription>
                            </DialogHeader>
                            <UserForm
                              onSubmit={handleUpdateUser}
                              initialData={{
                                name: user.name,
                                email: user.email,
                                role: user.role,
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                        {/* <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                          {user.status === 'active' ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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