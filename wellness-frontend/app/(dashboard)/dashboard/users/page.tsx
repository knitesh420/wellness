"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Grid3X3,
  List,
  Edit,
  Trash2,
  UserPlus,
  User,
  Eye,
  ShieldCheck,
  AlertCircle,
  Activity,
  History,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Upload,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserMinus,
  Settings,
  Crown,
  Stethoscope,
  Megaphone,
  ShoppingBag,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getApiV1Url } from "@/lib/utils/api";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "@/components/common/dashboard/Loader";
import Error from "@/components/common/dashboard/Error";
import NoData from "@/components/common/dashboard/NoData";
import Swal from "sweetalert2";

interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role:
  | "Admin"
  | "Doctor"
  | "Influencer"
  | "Customer"
  | "admin"
  | "doctor"
  | "influencer"
  | "customer";
  status: "Active" | "Inactive" | "active" | "inactive";
  imageUrl?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  bio?: string;
  address?: string;
  dateOfBirth?: string;
  followers?: number;
  platform?: string;
  commissionRate?: number;
  experience?: number;
  hospital?: string;
  consultationFee?: number;
  isActive?: boolean;
}

const userRoles = ["All", "Admin", "Doctor", "Influencer", "Customer"];
const userStatuses = ["All", "Active", "Inactive"];

const UsersPageContent = () => {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    role: "All",
    status: "All",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newUserFileInputRef = useRef<HTMLInputElement>(null);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    imageUrl: "",
    role: "Customer" as "Admin" | "Doctor" | "Influencer" | "Customer",
    status: "Active" as "Active" | "Inactive",
    dateOfBirth: "",
    address: "",
    bio: "",
    verified: false,
  });

  const getUserImage = (user: UserType) => {
    return user.imageUrl || "/placeholder-user.svg";
  };

  // Avatar upload functions
  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedUser) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedUser({
          ...selectedUser,
          imageUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        imageUrl: undefined,
      });
    }
  };

  // New User avatar functions
  const handleNewUserAvatarUpload = () => {
    newUserFileInputRef.current?.click();
  };

  const handleNewUserFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewUser({
          ...newUser,
          imageUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeNewUserAvatar = () => {
    setNewUser({
      ...newUser,
      imageUrl: "",
    });
  };

  // Fetch data on component mount
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", pagination.page.toString());
      queryParams.append("limit", pagination.limit.toString());
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.role && filters.role !== "All")
        queryParams.append("role", filters.role);
      if (filters.status && filters.status !== "All")
        queryParams.append("status", filters.status);

      // Attach auth token if available
      let token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("authToken") ||
            localStorage.getItem("accessToken"))) ||
        null;

      if (token && typeof token === "string") token = token.replace(/^"|"$/g, "");

      if (!token) {
        setError("Could not find authentication token. Please log in again.");
        setIsLoading(false);
        return;
      }

      const res = await fetch(getApiV1Url(`/users?${queryParams.toString()}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok || data.success) {
        setUsers(data.users || data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: data.total || data.pagination?.total || 0,
        }));
        setError("");
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  useEffect(() => {
    if (searchParams?.get("action") === "add") {
      setShowAddModal(true);
    }
  }, [searchParams]);

  // Pagination logic using Redux pagination
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Crown className="w-4 h-4" />;
      case "Doctor":
        return <Stethoscope className="w-4 h-4" />;
      case "Influencer":
        return <Megaphone className="w-4 h-4" />;
      case "Customer":
        return <ShoppingBag className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100";
      case "Doctor":
        return "bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100";
      case "Influencer":
        return "bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100";
      case "Customer":
        return "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4" />;
      case "Inactive":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100";
      case "Inactive":
        return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRoleChange = (value: string) => {
    setFilters((prev) => ({ ...prev, role: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleDeleteUser = async () => {
    // Prevent deleting admin users (check both lowercase and capitalized formats)
    const isAdminUser =
      selectedUser?.role === "Admin" || selectedUser?.role === "admin";

    if (!selectedUser || isAdminUser) return;

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${selectedUser.firstName} ${selectedUser.lastName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setModalLoading(true);
        try {
          // include auth token for protected route
          let token =
            (typeof window !== "undefined" &&
              (localStorage.getItem("authToken") ||
                localStorage.getItem("accessToken"))) ||
            null;

          if (token && typeof token === "string") token = token.replace(/^"|"$/g, "");

          const res = await fetch(getApiV1Url(`/users/${selectedUser._id}`), {
            method: "DELETE",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const data = await res.json();

          if (data.success) {
            setShowDeleteModal(false);
            setSelectedUser(null);
            fetchUsers();
            Swal.fire("Deleted!", "User has been deleted.", "success");
          } else {
            Swal.fire(
              "Error!",
              data.message || "Failed to delete user",
              "error",
            );
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error!", "Failed to delete user", "error");
        } finally {
          setModalLoading(false);
        }
      }
    });
  };

  const openViewModal = (user: UserType) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const openEditModal = (user: UserType) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setModalLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", selectedUser.firstName);
      formData.append("lastName", selectedUser.lastName);
      formData.append("email", selectedUser.email);
      formData.append("phone", selectedUser.phone);
      formData.append("role", selectedUser.role);
      formData.append("status", selectedUser.status);
      if (selectedUser.dateOfBirth)
        formData.append("dateOfBirth", selectedUser.dateOfBirth);
      if (selectedUser.address)
        formData.append("address", selectedUser.address);
      if (selectedUser.bio) formData.append("bio", selectedUser.bio);
      formData.append("verified", String(selectedUser.verified));

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      // include auth token for protected route
      let token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("authToken") ||
            localStorage.getItem("accessToken"))) ||
        null;

      if (token && typeof token === "string") token = token.replace(/^"|"$/g, "");

      const res = await fetch(getApiV1Url(`/users/${selectedUser._id}`), {
        method: "PUT",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (data.success) {
        setShowEditModal(false);
        fetchUsers();
        Swal.fire("Success", "User updated successfully", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to update user", "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error", "Failed to update user", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddUser = async () => {
    setModalLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", newUser.firstName);
      formData.append("lastName", newUser.lastName);
      formData.append("email", newUser.email);
      formData.append("password", "Password@123"); // Default password required by backend
      formData.append("phone", newUser.phone);
      formData.append("role", newUser.role);
      formData.append("status", newUser.status);

      if (newUserFileInputRef.current?.files?.[0]) {
        formData.append("image", newUserFileInputRef.current.files[0]);
      }

      // include auth token for protected route
      let token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("authToken") ||
            localStorage.getItem("accessToken"))) ||
        null;

      if (token && typeof token === "string") token = token.replace(/^"|"$/g, "");

      const res = await fetch(getApiV1Url("/users"), {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (data.success) {
        setShowAddModal(false);
        fetchUsers();
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          imageUrl: "",
          role: "Customer",
          status: "Active",
          dateOfBirth: "",
          address: "",
          bio: "",
          verified: false,
        });
        Swal.fire("Success", "User created successfully", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to create user", "error");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire("Error", "Failed to create user", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const openDeleteModal = (user: UserType) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 p-2"
      >
        {error ? (
          <Error title="Error loading users" message={error} />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Users Management
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage user accounts, roles, and platform permissions
                </p>
              </div>
              <Button
                onClick={() => setShowAddModal(true)}
                className="gap-2 shadow-sm rounded-lg"
              >
                <UserPlus className="w-4 h-4" />
                Create user
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 leading-none mb-2">Total users</p>
                      <h3 className="text-2xl font-bold text-slate-900">{pagination.total}</h3>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 leading-none mb-2">Active now</p>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {users.filter(u => u.status === 'Active' || u.status === 'active' || u.isActive).length}
                      </h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 leading-none mb-2">Doctors</p>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {users.filter(u => u.role === 'Doctor').length}
                      </h3>
                    </div>
                    <div className="p-3 bg-sky-50 rounded-lg">
                      <Stethoscope className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 leading-none mb-2">Influencers</p>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {users.filter(u => u.role === 'Influencer').length}
                      </h3>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <Megaphone className="w-5 h-5 text-pink-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-3 items-center">
                  <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search users..."
                      value={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="h-11 pl-11 rounded-lg bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <Select value={filters.role} onValueChange={handleRoleChange}>
                      <SelectTrigger className="w-full sm:w-[160px] h-11 rounded-lg bg-white border-slate-200 text-sm font-medium">
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        {userRoles.map((role) => (
                          <SelectItem key={role} value={role} className="text-sm">
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filters.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-full sm:w-[160px] h-11 rounded-lg bg-white border-slate-200 text-sm font-medium">
                        <SelectValue placeholder="All status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        {userStatuses.map((status) => (
                          <SelectItem key={status} value={status} className="text-sm">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                      {[
                        { mode: 'grid', icon: Grid3X3 },
                        { mode: 'list', icon: List },
                      ].map((item) => (
                        <Button
                          key={item.mode}
                          variant={viewMode === (item.mode as any) ? 'default' : 'ghost'}
                          size="icon"
                          onClick={() => setViewMode(item.mode as any)}
                          className={`h-9 w-9 rounded-md transition-all ${viewMode === item.mode
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                          <item.icon className="w-4 h-4" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            {isLoading ? (
              <Loader variant="skeleton" message="Loading users..." />
            ) : users.length === 0 ? (
              <NoData
                message="No users found"
                description="Get started by adding your first user"
                icon={
                  <User className="w-full h-full text-muted-foreground/60" />
                }
                action={{
                  label: "Add User",
                  onClick: () => setShowAddModal(true),
                }}
                size="lg"
              />
            ) : viewMode === "grid" ? (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {users.map((user) => (
                  <motion.div
                    key={user._id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full group border-slate-100 bg-white rounded-[24px] shadow-sm relative">
                      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-slate-50 to-indigo-50/30 border-b border-slate-50 z-0" />
                      <CardHeader className="pb-4 relative z-10 pt-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <Avatar className="w-20 h-20 border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500 relative z-10 ring-1 ring-slate-100">
                              <AvatarImage
                                src={getUserImage(user)}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-slate-50 text-xl font-black text-slate-400">
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white shadow-lg flex items-center justify-center border border-slate-100 z-20">
                              {getStatusIcon(user.status)}
                            </div>
                          </div>

                          <div className="space-y-1 w-full px-2">
                            <CardTitle className="text-xl font-black text-slate-900 tracking-tight truncate">
                              {user.firstName} {user.lastName}
                            </CardTitle>
                            <CardDescription className="text-[11px] font-medium text-slate-500 truncate flex items-center justify-center gap-1.5 uppercase tracking-wider">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </CardDescription>
                          </div>

                          <div className="flex flex-wrap justify-center gap-2 pt-2">
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-[10px] font-medium border-slate-200 bg-slate-50">
                                {user.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-6 pt-0 flex-1 flex flex-col">
                        <div className="space-y-2 text-sm flex-1">
                          <div className="flex justify-between items-center text-slate-500">
                            <span>Phone</span>
                            <span className="font-medium text-slate-900">{user.phone}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500">
                            <span>Status</span>
                            <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className="h-5 text-[10px]">
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                          <Button onClick={() => openViewModal(user)} variant="outline" size="sm" className="flex-1 h-9 rounded-lg border-slate-200 font-medium text-xs">
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            View
                          </Button>
                          <Button onClick={() => openEditModal(user)} variant="outline" size="sm" className="flex-1 h-9 rounded-lg border-slate-200 font-medium text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                            Edit
                          </Button>
                          {user.role !== "Admin" && (
                            <Button onClick={() => openDeleteModal(user)} variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg border-slate-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card className="border border-slate-200 shadow-sm overflow-hidden rounded-xl bg-white">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100">
                      <TableHead className="font-semibold text-slate-600 text-xs">User</TableHead>
                      <TableHead className="font-semibold text-slate-600 text-xs">Role</TableHead>
                      <TableHead className="font-semibold text-slate-600 text-xs">Status</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold text-slate-600 text-xs">Phone</TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold text-slate-600 text-xs">Created</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600 text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id} className="border-slate-100 hover:bg-slate-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 border border-slate-200">
                              <AvatarImage src={getUserImage(user)} />
                              <AvatarFallback className="text-xs font-bold">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{user.firstName} {user.lastName}</span>
                              <span className="text-xs text-slate-500 lowercase">{user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-medium">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className="h-5 text-[10px]">
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-slate-600">{user.phone}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-slate-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button onClick={() => openViewModal(user)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => openEditModal(user)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {user.role !== "Admin" && (
                              <Button onClick={() => openDeleteModal(user)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Pagination */}
            {!isLoading && users.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between px-2 pt-4">
                <p className="text-xs text-slate-500 font-medium">
                  Showing {startIndex + 1} to {Math.min(endIndex, pagination.total)} of {pagination.total} users
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(pagination.page - 1, 1))}
                    disabled={pagination.page === 1}
                    className="h-9 px-3 rounded-lg border-slate-200 text-xs font-medium"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={pagination.page === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${pagination.page === page ? 'shadow-sm' : 'border-slate-200 bg-white'}`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(pagination.page + 1, totalPages))}
                    disabled={pagination.page === totalPages}
                    className="h-9 px-3 rounded-lg border-slate-200 text-xs font-medium"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}        {/* View Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-xl max-h-[90vh] p-0 overflow-hidden border border-slate-200 shadow-xl rounded-xl bg-white">
            <DialogHeader className="p-6 border-b border-slate-100 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-semibold text-slate-900">User details</DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 mt-1">Full profile information and account metadata</DialogDescription>
                </div>
                <Badge variant="outline" className="h-6 rounded-full px-3">{selectedUser?.role}</Badge>
              </div>
            </DialogHeader>

            {selectedUser && (
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Avatar className="w-24 h-24 border-2 border-slate-100 shadow-sm">
                      <AvatarImage src={getUserImage(selectedUser)} />
                      <AvatarFallback className="text-2xl font-bold bg-slate-50 text-slate-400">
                        {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
                      <p className="text-sm text-slate-500">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone number</p>
                      <p className="text-sm font-medium text-slate-900">{selectedUser.phone || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                      <p className="text-sm font-medium text-slate-900">{selectedUser.status}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member since</p>
                      <p className="text-sm font-medium text-slate-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified</p>
                      <p className="text-sm font-medium text-slate-900">{selectedUser.verified ? "Yes" : "No"}</p>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bio notes</p>
                      <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 italic leading-relaxed">
                        "{selectedUser.bio || "No biography provided for this user."}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50">
              <Button variant="outline" onClick={() => setShowViewModal(false)} className="rounded-lg h-9">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-[32px] bg-white/95 backdrop-blur-xl">
            <DialogHeader className="px-8 pt-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl">
                  <UserCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Edit user profile</DialogTitle>
                  <DialogDescription className="text-slate-500 mt-1">Refine account parameters and manage professional identity</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {selectedUser && (
              <div className="px-8 pb-8 overflow-y-auto max-h-[70vh] custom-scrollbar scroll-smooth">
                <div className="space-y-8">
                  {/* Centered Avatar Section with Gradient Border */}
                  <div className="flex flex-col items-center justify-center py-8 px-4 bg-slate-50/50 rounded-[32px] border border-slate-100/50">
                    <div className="relative group p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-100">
                      <div className="p-1.5 rounded-full bg-white">
                        <Avatar className="w-24 h-24 border-0 group-hover:scale-105 transition-transform duration-500">
                          <AvatarImage src={selectedUser.imageUrl || "/placeholder-user.svg"} className="object-cover" />
                          <AvatarFallback className="font-black text-2xl bg-slate-50 text-slate-400">
                            {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <button
                        onClick={handleAvatarUpload}
                        className="absolute bottom-1 right-1 p-2.5 bg-white text-indigo-600 rounded-xl shadow-lg border border-slate-100 hover:scale-110 active:scale-95 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAvatarUpload}
                        className="h-9 px-4 rounded-xl border-slate-200 bg-white font-bold text-xs hover:bg-slate-50 transition-all"
                      >
                        Upload new photo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeAvatar}
                        className="h-9 px-4 rounded-xl font-bold text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                      >
                        Remove
                      </Button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 ml-1">First name</Label>
                      <Input
                        value={selectedUser.firstName}
                        onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium bg-white"
                        placeholder="e.g. Rahul"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 ml-1">Last name</Label>
                      <Input
                        value={selectedUser.lastName}
                        onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium bg-white"
                        placeholder="e.g. Sharma"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-semibold text-slate-700 ml-1">Phone number</Label>
                      <Input
                        value={selectedUser.phone}
                        onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium bg-white"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 ml-1">Assign role</Label>
                      <Select value={selectedUser.role} onValueChange={(value: any) => setSelectedUser({ ...selectedUser, role: value })}>
                        <SelectTrigger className="h-11 border-slate-200 rounded-xl font-medium bg-white focus:ring-0 focus:ring-offset-0 focus:border-indigo-500/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          <SelectItem value="Admin" className="font-medium">Admin</SelectItem>
                          <SelectItem value="Doctor" className="font-medium">Doctor</SelectItem>
                          <SelectItem value="Influencer" className="font-medium">Influencer</SelectItem>
                          <SelectItem value="Customer" className="font-medium">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 ml-1">Biography</Label>
                      <Textarea
                        rows={4}
                        value={selectedUser.bio || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, bio: e.target.value })}
                        placeholder="Tell us a bit about this user..."
                        className="rounded-2xl border-slate-200 focus:border-indigo-500/30 font-medium bg-white resize-none leading-relaxed p-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-white transition-all"
                onClick={() => setShowEditModal(false)}
                disabled={modalLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                onClick={handleUpdateUser}
                disabled={modalLoading}
              >
                {modalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add User Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-[32px] bg-white/95 backdrop-blur-xl">
            <DialogHeader className="px-8 pt-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <UserPlus className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Create new user</DialogTitle>
                  <DialogDescription className="text-slate-500 mt-1">Onboard a new member with specific platform permissions</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-8 pb-8 overflow-y-auto max-h-[70vh] custom-scrollbar scroll-smooth">
              <div className="space-y-8">
                {/* Centered Avatar Dropzone Styling */}
                <div className="flex flex-col items-center justify-center py-8 px-4 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 group hover:border-emerald-300 transition-colors">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                      <AvatarImage src={newUser.imageUrl || "/placeholder-user.svg"} className="object-cover" />
                      <AvatarFallback className="bg-white text-slate-400 font-black">
                        <User className="w-10 h-10" />
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={handleNewUserAvatarUpload}
                      className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewUserAvatarUpload}
                    className="h-9 px-4 rounded-xl border-slate-200 bg-white font-bold text-xs hover:border-emerald-200 hover:text-emerald-600 transition-all"
                  >
                    Upload profile photo
                  </Button>
                  <input ref={newUserFileInputRef} type="file" accept="image/*" onChange={handleNewUserFileSelect} className="hidden" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">First name</Label>
                    <Input placeholder="e.g. Rahul" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} className="h-11 rounded-xl border-slate-200 font-medium bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Last name</Label>
                    <Input placeholder="e.g. Sharma" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} className="h-11 rounded-xl border-slate-200 font-medium bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Email address</Label>
                    <Input type="email" placeholder="rahul@example.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="h-11 rounded-xl border-slate-200 font-medium bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Phone number</Label>
                    <Input placeholder="+91 XXXXX XXXXX" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="h-11 rounded-xl border-slate-200 font-medium bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">User role</Label>
                    <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger className="h-11 border-slate-200 rounded-xl font-medium bg-white focus:ring-0 focus:ring-offset-0 focus:border-indigo-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="Admin" className="font-medium">Admin</SelectItem>
                        <SelectItem value="Doctor" className="font-medium">Doctor</SelectItem>
                        <SelectItem value="Influencer" className="font-medium">Influencer</SelectItem>
                        <SelectItem value="Customer" className="font-medium">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Current status</Label>
                    <Select value={newUser.status} onValueChange={(value: any) => setNewUser({ ...newUser, status: value })}>
                      <SelectTrigger className="h-11 border-slate-200 rounded-xl font-medium bg-white focus:ring-0 focus:ring-offset-0 focus:border-indigo-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="Active" className="font-medium">Active</SelectItem>
                        <SelectItem value="Inactive" className="font-medium">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Professional bio</Label>
                    <Textarea placeholder="Add some notes about this user..." rows={4} value={newUser.bio} onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })} className="rounded-2xl border-slate-200 font-medium resize-none p-4 bg-white leading-relaxed" />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-white transition-all"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddUser}
                disabled={modalLoading}
                className="flex-1 h-12 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all hover:-translate-y-0.5"
              >
                {modalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create user"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-slate-900 font-bold">Delete user</DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Are you sure you want to delete <span className="font-bold text-slate-900">{selectedUser?.firstName} {selectedUser?.lastName}</span>? This action is permanent and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4 flex gap-2">
              <Button variant="outline" className="rounded-lg border-slate-200" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="destructive" className="rounded-lg" onClick={handleDeleteUser} disabled={modalLoading || selectedUser?.role === 'Admin'}>
                {modalLoading ? "Deleting..." : "Delete user"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </TooltipProvider >
  );
};

export default function UsersPage() {
  return (
    <React.Suspense fallback={<Loader variant="skeleton" message="Loading users..." />}>
      <UsersPageContent />
    </React.Suspense>
  );
}
