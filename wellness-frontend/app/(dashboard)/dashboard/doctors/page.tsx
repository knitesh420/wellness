"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  Stethoscope,
  Search,
  Eye,
  MapPin,
  Calendar,
  Users,
  Star,
  UserPlus,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  TrendingUp,
  CheckCircle,
  Award,
  GraduationCap,
  Shield,
  Heart,
  Brain,
  Bone,
  Eye as EyeIcon,
  Baby,
  Grid3X3,
  List,
  Upload,
  Camera,
  User,
  Mail,
  Phone,
  Banknote,
  Hospital,
  BookOpen,
  Briefcase,
  Clock,
  StickyNote,
  Globe,
  ChevronLeft as ChevronLeftIcon,
} from "lucide-react";
import { FormSteps } from "@/components/ui/form-steps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  fetchUsersData,
  setFilters,
  setPagination,
  selectUsersData,
  selectUsersLoading,
  selectUsersError,
  selectUsersPagination,
  updateUser,
  deleteUser,
  createUser,
  User as UserType,
} from "@/lib/redux/features/userSlice";
import Loader from "@/components/common/dashboard/Loader";
import Error from "@/components/common/dashboard/Error";
import NoData from "@/components/common/dashboard/NoData";

// Doctor type definition
type Doctor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  status: string;
  specialization: string;
  experience: number;
  rating: number;
  totalPatients: number;
  consultationFee: number;
  joinDate: string;
  location: string;
  qualifications: string;
  hospital: string;
  availability: string;
  languages: string[];
  tags: string[];
};

const DoctorsPage = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsersData);
  const isLoading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  const pagination = useAppSelector(selectUsersPagination);
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedDoctor, setSelectedDoctor] = useState<UserType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const addDoctorFileRef = useRef<HTMLInputElement>(null);
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    consultationFee: "",
    hospital: "",
    location: "",
    qualifications: "",
    status: "active",
    password: "Doctor@123",
    imageUrl: "",
  });

  // Fetch doctors data on component mount
  useEffect(() => {
    dispatch(setFilters({ role: "Doctor" }));
    dispatch(fetchUsersData());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams?.get("action") === "add") {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  // Convert users to doctors format and filter
  const doctors: Doctor[] = users
    .filter((user) => user.role === "Doctor")
    .map((user) => ({
      id: parseInt(user._id.slice(-8), 16) || Math.random(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      imageUrl: "",
      status: user.status.toLowerCase(),
      specialization: user.specialization || "General Practice",
      experience: user.experience || 0,
      rating: 4.5, // Default rating since not in API
      totalPatients: 0, // Default since not in API
      consultationFee: user.consultationFee || 1000,
      joinDate: user.createdAt,
      location: user.location || "Not specified",
      qualifications: user.qualifications || "MBBS",
      hospital: user.hospital || "Not specified",
      availability: user.availability || "Mon-Fri 9AM-5PM",
      languages: user.language || ["English"],
      tags: user.specialization ? [user.specialization] : [],
    }));

  // Filter and sort doctors
  const filteredDoctors = doctors
    .filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.phone.includes(searchTerm) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || doctor.status === statusFilter;
      const matchesSpecialization =
        specializationFilter === "all" ||
        doctor.specialization === specializationFilter;
      return matchesSearch && matchesStatus && matchesSpecialization;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const paginatedDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + pagination.limit,
  );

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
    dispatch(fetchUsersData());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const getSpecializationIcon = (specialization: string) => {
    switch (specialization.toLowerCase()) {
      case "cardiology":
        return Heart;
      case "neurology":
        return Brain;
      case "orthopedics":
        return Bone;
      case "ophthalmology":
        return EyeIcon;
      case "pediatrics":
        return Baby;
      case "dermatology":
        return Shield;
      default:
        return Stethoscope;
    }
  };

  const handleEditDoctor = (doctor: Doctor) => {
    // Find the corresponding user from Redux state
    const user = users.find(
      (u) =>
        u.role === "Doctor" && `${u.firstName} ${u.lastName}` === doctor.name,
    );
    if (user) {
      setSelectedDoctor(user);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteDoctor = async (doctorId: number) => {
    try {
      const user = users.find(
        (u) =>
          u.role === "Doctor" && parseInt(u._id.slice(-8), 16) === doctorId,
      );
      if (user) {
        const success = (await dispatch(
          deleteUser(user._id),
        )) as unknown as boolean;
        if (success) {
          dispatch(fetchUsersData());
        }
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleAddDoctorImageUpload = () => {
    addDoctorFileRef.current?.click();
  };

  const handleAddDoctorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewDoctor((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAddDoctorImage = () => {
    setNewDoctor((prev) => ({ ...prev, imageUrl: "" }));
    if (addDoctorFileRef.current) {
      addDoctorFileRef.current.value = "";
    }
  };

  const handleAddDoctor = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", newDoctor.firstName);
      formData.append("lastName", newDoctor.lastName);
      formData.append("email", newDoctor.email);
      formData.append("phone", newDoctor.phone);
      formData.append("password", newDoctor.password);
      formData.append("role", "Doctor");
      formData.append("status", newDoctor.status);
      formData.append("specialization", newDoctor.specialization);
      formData.append("experience", newDoctor.experience);
      formData.append("consultationFee", newDoctor.consultationFee);
      formData.append("hospital", newDoctor.hospital);
      formData.append("location", newDoctor.location);
      formData.append("qualifications", newDoctor.qualifications);

      if (addDoctorFileRef.current?.files?.[0]) {
        formData.append("image", addDoctorFileRef.current.files[0]);
      }

      const success = (await dispatch(createUser(formData as any))) as unknown as boolean;
      if (success) {
        setIsAddModalOpen(false);
        setNewDoctor({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          specialization: "",
          experience: "",
          consultationFee: "",
          hospital: "",
          location: "",
          qualifications: "",
          status: "active",
          password: "Doctor@123",
          imageUrl: "",
        });
        if (addDoctorFileRef.current) {
          addDoctorFileRef.current.value = "";
        }
        dispatch(fetchUsersData());
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const handleUpdateDoctor = async () => {
    try {
      if (selectedDoctor) {
        const success = (await dispatch(
          updateUser(selectedDoctor._id, selectedDoctor),
        )) as unknown as boolean;
        if (success) {
          setIsEditModalOpen(false);
          dispatch(fetchUsersData());
        }
      }
    } catch (error) {
      console.error("_error updating doctor:", error);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {error ? (
          <Error title="Error loading doctors" message={error} />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctors</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage medical professionals and specialists
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 gap-2 rounded-lg border-slate-200">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  size="sm"
                  className="h-9 gap-2 rounded-lg shadow-sm"
                  type="button"
                >
                  <UserPlus className="w-4 h-4" />
                  Add doctor
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total doctors</p>
                      <p className="text-2xl font-bold text-slate-900">{doctors.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% from last month
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active doctors</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {doctors.filter((d) => d.status === "active").length}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
                    {Math.round((doctors.filter((d) => d.status === "active").length / doctors.length) * 100)}% of total
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Specializations</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {new Set(doctors.map((d) => d.specialization)).size}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-purple-600 font-medium">Medical fields recorded</div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Avg. rating</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {(doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / (doctors.length || 1)).toFixed(1)}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                      <Star className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-orange-600 font-medium">
                    <Star className="w-3 h-3 mr-1" />
                    Out of 5.0 base
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 rounded-lg border-slate-200 focus:border-primary/30 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 h-10 border-slate-200 rounded-lg text-sm bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger className="w-44 h-10 border-slate-200 rounded-lg text-sm bg-white">
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="all">All fields</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none h-10 w-10 p-0"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-none h-10 w-10 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            {/* Content */}
            {isLoading ? (
              <Loader variant="skeleton" message="Loading doctors..." />
            ) : filteredDoctors.length === 0 ? (
              <NoData
                message="No doctors found"
                description="Get started by adding your first doctor"
                icon={
                  <Stethoscope className="w-full h-full text-muted-foreground/60" />
                }
                action={{
                  label: "Add Doctor",
                  onClick: () => setIsAddModalOpen(true),
                }}
                size="lg"
              />
            ) : viewMode === "table" ? (
              <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="text-xs font-semibold uppercase text-slate-500 py-4">Doctor</TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-slate-500 py-4">Specialization</TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-slate-500 py-4">Status</TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-slate-500 py-4">Experience</TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-slate-500 py-4 text-right">Consultation</TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-slate-500 py-4 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDoctors.map((doctor) => {
                        return (
                          <TableRow key={doctor.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 border border-slate-100 shadow-sm">
                                  <AvatarImage src={doctor.imageUrl} className="object-cover" />
                                  <AvatarFallback className="bg-slate-100 text-slate-400 font-medium text-xs">
                                    {doctor.name.split(" ").map((n) => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-slate-900 text-sm leading-tight">{doctor.name}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">{doctor.hospital}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge variant="outline" className="font-medium text-[11px] border-slate-200 bg-white text-slate-600">
                                {doctor.specialization}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge variant={doctor.status === 'active' ? 'default' : 'secondary'} className="rounded-full text-[10px] font-bold px-2.5 h-6">
                                {doctor.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4">
                              <span className="text-sm text-slate-600">{doctor.experience} years</span>
                            </TableCell>
                            <TableCell className="py-4 text-right">
                              <span className="text-sm font-bold text-slate-900">₹{doctor.consultationFee}</span>
                            </TableCell>
                            <TableCell className="py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary transition-colors" onClick={() => handleEditDoctor(doctor)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 transition-colors" onClick={() => handleEditDoctor(doctor)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 transition-colors" onClick={() => handleDeleteDoctor(doctor.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedDoctors.map((doctor) => {
                  return (
                    <Card key={doctor.id} className="group border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[24px] overflow-hidden flex flex-col bg-white">
                      <div className="h-20 bg-gradient-to-br from-slate-50 to-indigo-50/30 border-b border-slate-50" />
                      <CardContent className="p-6 pt-0 flex-1 flex flex-col -mt-10">
                        <div className="flex flex-col items-center text-center space-y-4 mb-6">
                          <Avatar className="w-20 h-20 border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500 relative z-10">
                            <AvatarImage src={doctor.imageUrl} className="object-cover" />
                            <AvatarFallback className="bg-slate-50 text-slate-400 text-xl font-black">
                              {doctor.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{doctor.name}</h3>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{doctor.specialization}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6 flex-1">
                          <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <span className="text-xs text-slate-400">Experience</span>
                            <span className="text-sm font-semibold text-slate-900">{doctor.experience} years</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <span className="text-xs text-slate-400">Rating</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                              <span className="text-sm font-semibold text-slate-900">{doctor.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <span className="text-xs text-slate-400">Hospital</span>
                            <span className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">{doctor.hospital}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Consultation</p>
                            <p className="text-xl font-black text-slate-900">₹{doctor.consultationFee}</p>
                          </div>
                          <Badge variant={doctor.status === 'active' ? 'default' : 'secondary'} className="rounded-lg font-bold px-3">
                            {doctor.status}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-10 rounded-xl border-slate-200 font-bold text-xs hover:bg-slate-50 transition-colors"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 h-10 rounded-xl font-bold text-xs shadow-sm"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredDoctors.length > 0 && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pb-10">
                <p className="text-sm text-slate-500 font-medium">
                  Showing <span className="text-slate-900 font-bold">{startIndex + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(startIndex + pagination.limit, filteredDoctors.length)}</span> of <span className="text-slate-900 font-bold">{filteredDoctors.length}</span> doctors
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-xl border-slate-200"
                    onClick={() => handlePageChange(Math.max(pagination.page - 1, 1))}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={pagination.page === p ? "default" : "outline"}
                        size="sm"
                        className={`h-10 w-10 p-0 rounded-xl font-bold text-xs ${pagination.page === p ? 'shadow-md' : 'border-slate-200 text-slate-600'}`}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-xl border-slate-200"
                    onClick={() => handlePageChange(Math.min(pagination.page + 1, totalPages))}
                    disabled={pagination.page === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Add Doctor Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) setAddStep(1);
        }}>
          <DialogContent className="max-w-2xl p-0 gap-0 rounded-xl border-slate-200 shadow-xl overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-slate-100">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Add new doctor</DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  Onboard a new medical professional to the platform
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="px-6 py-6 ring-1 ring-slate-50">
              <FormSteps
                currentStep={addStep}
                steps={[
                  { id: 1, name: "Identity" },
                  { id: 2, name: "Professional" },
                  { id: 3, name: "Profile" },
                ]}
              />
            </div>

            <div className="px-6 py-6 bg-slate-50/30">
              {addStep === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">First name</Label>
                      <Input
                        placeholder="John"
                        value={newDoctor.firstName}
                        onChange={(e) => setNewDoctor({ ...newDoctor, firstName: e.target.value })}
                        className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Last name</Label>
                      <Input
                        placeholder="Doe"
                        value={newDoctor.lastName}
                        onChange={(e) => setNewDoctor({ ...newDoctor, lastName: e.target.value })}
                        className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Email</Label>
                      <Input
                        type="email"
                        placeholder="doctor@example.com"
                        value={newDoctor.email}
                        onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                        className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Phone</Label>
                      <Input
                        placeholder="+91 98765 43210"
                        value={newDoctor.phone}
                        onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                        className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Specialization</Label>
                      <Select value={newDoctor.specialization} onValueChange={(v) => setNewDoctor({ ...newDoctor, specialization: v })}>
                        <SelectTrigger className="h-10 border-slate-200 rounded-lg bg-white">
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg shadow-xl">
                          {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Ophthalmology", "Psychiatry", "General Medicine"].map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {addStep === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Experience (years)</Label>
                      <Input
                        type="number"
                        placeholder="Years of practice"
                        value={newDoctor.experience}
                        onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                        className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Consultation fee (₹)</Label>
                      <Input
                        type="number"
                        placeholder="Standard fee"
                        value={newDoctor.consultationFee}
                        onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: e.target.value })}
                        className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Hospital</Label>
                      <Input
                        placeholder="Organization name"
                        value={newDoctor.hospital}
                        onChange={(e) => setNewDoctor({ ...newDoctor, hospital: e.target.value })}
                        className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Location</Label>
                      <Input
                        placeholder="City, State"
                        value={newDoctor.location}
                        onChange={(e) => setNewDoctor({ ...newDoctor, location: e.target.value })}
                        className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Qualifications</Label>
                      <Textarea
                        placeholder="Degrees & Certifications (e.g. MBBS, MD, PhD)"
                        rows={3}
                        value={newDoctor.qualifications}
                        onChange={(e) => setNewDoctor({ ...newDoctor, qualifications: e.target.value })}
                        className="min-h-[100px] rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {addStep === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        <AvatarImage src={newDoctor.imageUrl} className="object-cover" />
                        <AvatarFallback className="text-2xl font-bold bg-slate-50 text-slate-400">
                          {newDoctor.firstName?.[0]}{newDoctor.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={handleAddDoctorImageUpload}
                        className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md hover:scale-110 transition-transform"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Profile photo</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Availability</Label>
                      <Input
                        placeholder="e.g. Mon-Sat (9AM-5PM)"
                        className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Password</Label>
                      <Input
                        type="password"
                        value={newDoctor.password}
                        onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                        className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg px-4 font-medium"
                onClick={() => addStep > 1 ? setAddStep(addStep - 1) : setIsAddModalOpen(false)}
              >
                {addStep === 1 ? "Cancel" : "Previous"}
              </Button>
              <div className="flex gap-2">
                {addStep < 3 ? (
                  <Button
                    size="sm"
                    className="h-9 rounded-lg px-6 font-medium shadow-sm"
                    onClick={() => setAddStep(addStep + 1)}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={handleAddDoctor} disabled={isLoading} size="sm" className="h-9 rounded-lg px-6 font-medium shadow-sm">
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
                    ) : (
                      <><UserPlus className="w-4 h-4 mr-2" /> Add doctor</>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <input type="file" ref={addDoctorFileRef} className="hidden" accept="image/*" onChange={handleAddDoctorFileChange} />
          </DialogContent>
        </Dialog>

        {/* Edit Doctor Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-3xl p-0 gap-0 rounded-xl border-slate-200 shadow-xl overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-slate-100">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Edit doctor details</DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  Manage doctor information, including specialization and contact details
                </DialogDescription>
              </DialogHeader>
            </div>

            {selectedDoctor && (
              <div className="px-6 py-6 bg-slate-50/30">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-6 w-full max-w-[400px]">
                    <TabsTrigger value="details" className="flex-1 rounded-md text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Personal details</TabsTrigger>
                    <TabsTrigger value="schedule" className="flex-1 rounded-md text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Schedule</TabsTrigger>
                    <TabsTrigger value="patients" className="flex-1 rounded-md text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Patients</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-0 animate-in fade-in duration-300">
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateDoctor(); }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-slate-700">First name</Label>
                          <Input
                            value={selectedDoctor.firstName}
                            onChange={(e) => setSelectedDoctor({ ...selectedDoctor, firstName: e.target.value })}
                            className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-slate-700">Last name</Label>
                          <Input
                            value={selectedDoctor.lastName}
                            onChange={(e) => setSelectedDoctor({ ...selectedDoctor, lastName: e.target.value })}
                            className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-slate-700">Email</Label>
                          <Input
                            type="email"
                            value={selectedDoctor.email}
                            onChange={(e) => setSelectedDoctor({ ...selectedDoctor, email: e.target.value })}
                            className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-slate-700">Phone</Label>
                          <Input
                            value={selectedDoctor.phone}
                            onChange={(e) => setSelectedDoctor({ ...selectedDoctor, phone: e.target.value })}
                            className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-slate-700">Specialization</Label>
                          <Select value={selectedDoctor.specialization} onValueChange={(v) => setSelectedDoctor({ ...selectedDoctor, specialization: v })}>
                            <SelectTrigger className="h-10 border-slate-200 rounded-lg bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                              {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Ophthalmology"].map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-slate-700">Experience (years)</Label>
                          <Input
                            type="number"
                            value={selectedDoctor?.experience || ''}
                            onChange={(e) => selectedDoctor && setSelectedDoctor({ ...selectedDoctor, experience: Number(e.target.value) })}
                            className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-slate-700">Consultation fee (₹)</Label>
                          <Input
                            type="number"
                            value={selectedDoctor?.consultationFee || ''}
                            onChange={(e) => selectedDoctor && setSelectedDoctor({ ...selectedDoctor, consultationFee: Number(e.target.value) })}
                            className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-slate-700">Status</Label>
                          <Select value={selectedDoctor?.status || 'Active'} onValueChange={(v) => selectedDoctor && setSelectedDoctor({ ...selectedDoctor, status: v as "Active" | "Inactive" })}>
                            <SelectTrigger className="h-10 border-slate-200 rounded-lg bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <Label className="text-sm font-medium text-slate-700">Hospital</Label>
                          <Input
                            value={selectedDoctor?.hospital || ''}
                            onChange={(e) => selectedDoctor && setSelectedDoctor({ ...selectedDoctor, hospital: e.target.value })}
                            className="h-10 rounded-lg border-slate-200 focus:border-primary/30"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <Label className="text-sm font-medium text-slate-700">Qualifications</Label>
                          <Textarea
                            rows={3}
                            value={selectedDoctor?.qualifications || ''}
                            onChange={(e) => selectedDoctor && setSelectedDoctor({ ...selectedDoctor, qualifications: e.target.value })}
                            className="min-h-[80px] rounded-lg border-slate-200 focus:border-primary/30"
                          />
                        </div>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="schedule" className="mt-0 animate-in fade-in duration-300">
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-6 h-6 text-blue-500" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800 mb-1">Weekly schedule</h3>
                      <p className="text-sm text-slate-500 mb-6">Manage available consultation slots</p>
                      <Button variant="outline" size="sm" className="rounded-lg h-9">Configure schedule</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="patients" className="mt-0 animate-in fade-in duration-300">
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-blue-500" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800 mb-1">Patient records</h3>
                      <p className="text-sm text-slate-500 mb-6">View history of consultation sessions</p>
                      <Button variant="outline" size="sm" className="rounded-lg h-9">View records</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">
              <Button variant="outline" size="sm" className="h-9 px-6 rounded-lg font-medium" onClick={() => setIsEditModalOpen(false)} disabled={isLoading}>Cancel</Button>
              <Button
                size="sm"
                className="h-9 px-6 rounded-lg font-medium shadow-sm"
                onClick={handleUpdateDoctor}
                disabled={isLoading}
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : "Save changes"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

// Export as dynamic component to prevent prerendering issues
export default dynamic(() => Promise.resolve(DoctorsPage), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  ),
});
