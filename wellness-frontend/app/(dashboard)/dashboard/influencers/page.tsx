"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  Megaphone,
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
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Grid3X3,
  List,
  Upload,
  Camera,
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
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import Loader from "@/components/common/dashboard/Loader";
import Error from "@/components/common/dashboard/Error";
import NoData from "@/components/common/dashboard/NoData";
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
  User as UserType,
} from "@/lib/redux/features/userSlice";

// Influencer type definition
type Influencer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  status: string;
  platform: string;
  followers: number;
  category: string;
  commissionRate: number;
  joinDate: string;
  location: string;
  socialMediaLinks: string;
  availability: string;
  languages: string[];
  tags: string[];
  note: string;
};

const InfluencersPage = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsersData);
  const isLoading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  const pagination = useAppSelector(selectUsersPagination);
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedInfluencer, setSelectedInfluencer] = useState<UserType | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch influencers data on component mount
  useEffect(() => {
    dispatch(setFilters({ role: "Influencer" }));
    dispatch(fetchUsersData());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams?.get("action") === "add") {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  // Convert users to influencers format and filter
  const influencers: Influencer[] = users
    .filter((user) => user.role === "Influencer")
    .map((user) => ({
      id: parseInt(user._id.slice(-8), 16) || Math.random(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      imageUrl: "",
      status: user.status.toLowerCase(),
      platform: user.platform || "Instagram",
      followers: user.followers || 0,
      category: user.category || "Health & Wellness",
      commissionRate: user.commissionRate || 10,
      joinDate: user.createdAt,
      location: user.address || "Not specified",
      socialMediaLinks: user.socialMediaLinks || "",
      availability: user.availability || "Mon-Fri 9AM-5PM",
      languages: user.language || ["English"],
      tags: user.category ? [user.category] : [],
      note: user.note || "",
    }));

  // Filter and sort influencers
  const filteredInfluencers = influencers
    .filter((influencer) => {
      const matchesSearch =
        influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.phone.includes(searchTerm) ||
        influencer.platform.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || influencer.status === statusFilter;
      const matchesPlatform =
        platformFilter === "all" || influencer.platform === platformFilter;
      return matchesSearch && matchesStatus && matchesPlatform;
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
  const paginatedInfluencers = filteredInfluencers.slice(
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

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return Instagram;
      case "youtube":
        return Youtube;
      case "twitter":
        return Twitter;
      case "facebook":
        return Facebook;
      default:
        return Megaphone;
    }
  };

  const handleEditInfluencer = (influencer: Influencer) => {
    const user = users.find(
      (u) =>
        u.role === "Influencer" &&
        `${u.firstName} ${u.lastName}` === influencer.name,
    );
    if (user) {
      setSelectedInfluencer(user);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteInfluencer = async (influencerId: number) => {
    setModalLoading(true);
    try {
      const user = users.find(
        (u) =>
          u.role === "Influencer" &&
          parseInt(u._id.slice(-8), 16) === influencerId,
      );
      if (user) {
        const success = (await dispatch(
          deleteUser(user._id),
        )) as unknown as boolean;
        if (success) {
          dispatch(fetchUsersData());
        }
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddInfluencer = async (influencerData: Partial<Influencer>) => {
    setModalLoading(true);
    try {
      setIsAddModalOpen(false);
      dispatch(fetchUsersData());
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateInfluencer = async () => {
    setModalLoading(true);
    try {
      if (selectedInfluencer) {
        const success = (await dispatch(
          updateUser(selectedInfluencer._id, selectedInfluencer),
        )) as unknown as boolean;
        if (success) {
          setIsEditModalOpen(false);
          dispatch(fetchUsersData());
        }
      }
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-8 p-1">
        {error ? (
          <Error title="Error loading influencers" message={error} />
        ) : (
          <>
            {/* Header section with refined typography */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Influencer Network
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Orchestrate your creator partnerships and monitor brand resonance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-5 rounded-xl border-slate-200 bg-white font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  className="h-10 px-5 rounded-xl font-bold text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add partner
                </Button>
              </div>
            </div>

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total partners", value: influencers.length, icon: Megaphone, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Active resonance", value: influencers.filter(i => i.status === "active").length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Channel diversity", value: new Set(influencers.map(i => i.platform)).size, icon: Instagram, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Avg. commission", value: `${influencers.length > 0 ? (influencers.reduce((sum, i) => sum + i.commissionRate, 0) / influencers.length).toFixed(1) : "0"}%`, icon: Star, color: "text-orange-600", bg: "bg-orange-50" },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-110 transition-transform duration-500`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Refined Filter & Search Bar */}
            <Card className="border-none shadow-sm rounded-2xl bg-white/80 backdrop-blur-md overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      placeholder="Search partners by name, email, platform..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-11 pl-11 rounded-xl bg-slate-50 border-transparent focus:border-indigo-500/30 focus:bg-white transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px] h-11 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs uppercase tracking-widest text-slate-600 focus:ring-indigo-500/20">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                        <SelectItem value="all" className="text-xs font-bold uppercase tracking-wider">All status</SelectItem>
                        <SelectItem value="active" className="text-xs font-bold uppercase tracking-wider">Active</SelectItem>
                        <SelectItem value="inactive" className="text-xs font-bold uppercase tracking-wider">Inactive</SelectItem>
                        <SelectItem value="pending" className="text-xs font-bold uppercase tracking-wider">Pending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                      <SelectTrigger className="w-[140px] h-11 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs uppercase tracking-widest text-slate-600 focus:ring-indigo-500/20">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                        <SelectItem value="all" className="text-xs font-bold uppercase tracking-wider">All platforms</SelectItem>
                        <SelectItem value="Instagram" className="text-xs font-bold uppercase tracking-wider">Instagram</SelectItem>
                        <SelectItem value="Youtube" className="text-xs font-bold uppercase tracking-wider">YouTube</SelectItem>
                        <SelectItem value="Twitter" className="text-xs font-bold uppercase tracking-wider">Twitter</SelectItem>
                        <SelectItem value="Facebook" className="text-xs font-bold uppercase tracking-wider">Facebook</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl ml-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`h-9 px-4 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                      >
                        <Grid3X3 className="w-4 h-4 mr-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Grid</span>
                      </Button>
                      <Button
                        variant={viewMode === "table" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className={`h-9 px-4 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                      >
                        <List className="w-4 h-4 mr-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Table</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Display */}
            {isLoading ? (
              <Loader variant="skeleton" message="Accessing network database..." />
            ) : filteredInfluencers.length === 0 ? (
              <NoData
                message="No matches detected"
                description="The search parameters did not yield any influencer profiles from the current network."
                icon={<Megaphone className="w-full h-full text-slate-200" />}
                size="lg"
              />
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedInfluencers.map((influencer) => {
                      const PlatformIcon = getPlatformIcon(influencer.platform);
                      return (
                        <Card
                          key={influencer.id}
                          className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-[24px] bg-white overflow-hidden flex flex-col h-full"
                        >
                          <CardHeader className="pb-4 pt-6 px-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 rounded-2xl border-2 border-indigo-50 shadow-sm ring-4 ring-indigo-50/20">
                                  <AvatarImage src={influencer.imageUrl} alt={influencer.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
                                    {influencer.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                  <CardTitle className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                                    {influencer.name}
                                  </CardTitle>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={getStatusColor(influencer.status)} className="h-5 rounded-lg px-2 text-[10px] font-bold uppercase tracking-wider">
                                      {influencer.status}
                                    </Badge>
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest leading-none">
                                      <PlatformIcon className="w-3 h-3 text-indigo-500" />
                                      {influencer.platform}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6 flex-1 flex flex-col px-6 pb-6 pt-0">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  Followers
                                </span>
                                <p className="text-sm font-black text-slate-700">{influencer.followers.toLocaleString()}</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  Commission
                                </span>
                                <p className="text-sm font-black text-indigo-600">{influencer.commissionRate}%</p>
                              </div>
                            </div>

                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <MapPin className="w-3 h-3 text-indigo-400" />
                                {influencer.location}
                              </div>
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <Award className="w-3 h-3 text-indigo-400" />
                                {influencer.category}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-slate-50 mt-auto">
                              <Button
                                onClick={() => handleEditInfluencer(influencer)}
                                variant="outline"
                                className="flex-1 h-10 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-slate-50"
                              >
                                <Edit className="w-4 h-4" />
                                Modify
                              </Button>
                              <Button
                                onClick={() => { }}
                                className="flex-1 h-10 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-100/50 hover:bg-transparent">
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Partner Identity</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Platform Metrics</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Specialization</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Status</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedInfluencers.map((influencer) => (
                          <TableRow key={influencer.id} className="border-slate-100/50 group transition-colors hover:bg-slate-50/50">
                            <TableCell className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-xl border-2 border-slate-50 group-hover:scale-105 transition-transform">
                                  <AvatarImage src={influencer.imageUrl} alt={influencer.name} />
                                  <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs">
                                    {influencer.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-900">{influencer.name}</span>
                                  <span className="text-xs font-medium text-slate-400">{influencer.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                  {React.createElement(getPlatformIcon(influencer.platform), { className: "w-3 h-3 text-indigo-500" })}
                                  <span className="text-sm">{influencer.platform}</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                                  {influencer.followers.toLocaleString()} REACH
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <Badge variant="outline" className="rounded-lg border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                {influencer.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <Badge variant={getStatusColor(influencer.status)} className="rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                {influencer.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => handleEditInfluencer(influencer)}
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Modify Record</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => handleDeleteInfluencer(influencer.id)}
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Erase Profile</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                )}

                {/* Pagination Control */}
                {filteredInfluencers.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 pt-4">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Page {pagination.page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(Math.max(pagination.page - 1, 1))}
                        disabled={pagination.page === 1}
                        className="h-10 px-4 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1 mx-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={pagination.page === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${pagination.page === page ? 'bg-slate-900 shadow-lg scale-110' : 'border-slate-200'}`}
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
                        className="h-10 px-4 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest transition-all"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Add Influencer Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-[32px] bg-white/95 backdrop-blur-xl">
                <DialogHeader className="px-10 pt-10 pb-6 bg-gradient-to-br from-slate-50 to-white">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Onboard partner</DialogTitle>
                      <DialogDescription className="text-slate-500 font-medium leading-relaxed">
                        Integrate a new social resonance node into the ecosystem
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="px-10 pb-10 space-y-8">
                  <div className="group relative flex flex-col items-center py-8 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all duration-500">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-500">
                        <AvatarFallback className="text-2xl font-black bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                          <Camera className="w-8 h-8 opacity-40" />
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute -bottom-1 -right-1 p-2.5 bg-indigo-600 text-white rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                      Deploy profile visual
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="addName" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Identity name</Label>
                      <Input id="addName" placeholder="e.g. Rahul Sharma" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500/30 transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addEmail" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email gateway</Label>
                      <Input id="addEmail" type="email" placeholder="rahul@example.com" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500/30 transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addPhone" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Contact pulse</Label>
                      <Input id="addPhone" placeholder="+91 XXXXX XXXXX" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500/30 transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addPlatform" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Digital channel</Label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-bold text-[10px] uppercase tracking-wider text-slate-600">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                          <SelectItem value="Instagram" className="text-xs font-bold uppercase tracking-wider">Instagram</SelectItem>
                          <SelectItem value="Youtube" className="text-xs font-bold uppercase tracking-wider">YouTube</SelectItem>
                          <SelectItem value="Twitter" className="text-xs font-bold uppercase tracking-wider">Twitter</SelectItem>
                          <SelectItem value="Facebook" className="text-xs font-bold uppercase tracking-wider">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addFollowers" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Reach index</Label>
                      <Input id="addFollowers" type="number" placeholder="e.g. 50000" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500/30 transition-all font-black" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addCommission" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Incentive rate (%)</Label>
                      <Input id="addCommission" type="number" placeholder="e.g. 10" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500/30 transition-all font-black text-indigo-600" />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 mt-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-2xl border-slate-200 font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Abort
                    </Button>
                    <Button
                      onClick={() => handleAddInfluencer({})}
                      disabled={modalLoading}
                      className="flex-1 h-12 rounded-2xl font-bold text-xs uppercase tracking-widest bg-slate-900 text-white shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {modalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize integration"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Influencer Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl rounded-[32px] bg-white/95 backdrop-blur-2xl">
                {selectedInfluencer && (
                  <div className="flex flex-col h-[85vh]">
                    {/* Modal Identity Header */}
                    <div className="px-10 pt-10 pb-6 bg-gradient-to-br from-indigo-50/50 via-white to-transparent border-b border-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[28px] blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                            <Avatar className="relative w-24 h-24 border-4 border-white shadow-2xl rounded-[24px]">
                              <AvatarImage src={selectedInfluencer.imageUrl} className="object-cover" />
                              <AvatarFallback className="text-2xl font-black bg-slate-50 text-slate-300">
                                {selectedInfluencer.firstName[0]}{selectedInfluencer.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <button className="absolute -bottom-2 -right-2 p-2.5 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                              <Camera className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                {selectedInfluencer.firstName} {selectedInfluencer.lastName}
                              </h2>
                              <Badge className="bg-indigo-500 text-white border-none rounded-xl h-6 font-bold text-[10px] uppercase tracking-widest px-3">
                                {selectedInfluencer.platform}
                              </Badge>
                            </div>
                            <p className="text-sm font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest leading-none">
                              <Megaphone className="w-4 h-4 text-indigo-400" />
                              {selectedInfluencer.category} Resonance
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar">
                      <Tabs defaultValue="details" className="space-y-10">
                        <TabsList className="bg-slate-100/50 p-1.5 rounded-[20px] h-14 border border-slate-200/50 backdrop-blur-sm gap-1">
                          {[
                            { value: "details", label: "Identity" },
                            { value: "partnership", label: "Metrics" },
                            { value: "history", label: "Campaigns" },
                            { value: "notes", label: "Intelligence" }
                          ].map((tab) => (
                            <TabsTrigger
                              key={tab.value}
                              value={tab.value}
                              className="flex-1 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg active:scale-95 transition-all text-slate-400"
                            >
                              {tab.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        <TabsContent value="details" className="mt-0 focus-visible:ring-0 outline-none">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                              { id: "editFirstName", label: "First identity", value: selectedInfluencer.firstName },
                              { id: "editLastName", label: "Last identity", value: selectedInfluencer.lastName },
                              { id: "editEmail", label: "Email gateway", value: selectedInfluencer.email },
                              { id: "editPhone", label: "Contact pulse", value: selectedInfluencer.phone }
                            ].map((field) => (
                              <div key={field.id} className="space-y-2">
                                <Label htmlFor={field.id} className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">{field.label}</Label>
                                <Input
                                  id={field.id}
                                  className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500/30 transition-all font-medium"
                                  defaultValue={field.value}
                                />
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="partnership" className="mt-0 focus-visible:ring-0 outline-none">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">Primary channel</Label>
                              <Select defaultValue={selectedInfluencer.platform}>
                                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-bold text-[10px] uppercase tracking-wider text-slate-600">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                                  <SelectItem value="Instagram" className="text-xs font-bold uppercase tracking-wider">Instagram</SelectItem>
                                  <SelectItem value="Youtube" className="text-xs font-bold uppercase tracking-wider">YouTube</SelectItem>
                                  <SelectItem value="Twitter" className="text-xs font-bold uppercase tracking-wider">Twitter</SelectItem>
                                  <SelectItem value="Facebook" className="text-xs font-bold uppercase tracking-wider">Facebook</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">Reach index</Label>
                              <Input
                                type="number"
                                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500/30 transition-all font-black text-rose-500"
                                defaultValue={selectedInfluencer.followers}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">Incentive rate (%)</Label>
                              <Input
                                type="number"
                                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500/30 transition-all font-black text-emerald-500"
                                defaultValue={selectedInfluencer.commissionRate}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">Profile Category</Label>
                              <Input
                                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500/30 transition-all font-medium"
                                defaultValue={selectedInfluencer.category}
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="history" className="mt-0 focus-visible:ring-0 outline-none">
                          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30 rounded-[32px] border-2 border-dashed border-slate-100">
                            <div className="relative mb-6">
                              <div className="absolute -inset-4 bg-indigo-500/5 blur-2xl rounded-full"></div>
                              <div className="relative w-20 h-20 bg-white rounded-[24px] shadow-2xl flex items-center justify-center transition-transform hover:rotate-6 duration-500">
                                <Calendar className="w-10 h-10 text-indigo-500" />
                              </div>
                            </div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2">Campaign history</h4>
                            <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-widest max-w-[240px]">No active campaigns recorded in registry</p>
                          </div>
                        </TabsContent>

                        <TabsContent value="notes" className="mt-0 focus-visible:ring-0 outline-none">
                          <div className="space-y-3">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">Internal intelligence</Label>
                            <Textarea
                              placeholder="Add private observations or negotiation details..."
                              className="min-h-[200px] rounded-[24px] border-slate-100 bg-slate-50/30 p-8 focus:bg-white focus:border-indigo-500/30 transition-all text-sm font-medium leading-relaxed custom-scrollbar"
                              defaultValue={selectedInfluencer.note}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 h-14 rounded-2xl border-slate-200 font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-white transition-all"
                        onClick={() => setIsEditModalOpen(false)}
                      >
                        Discard Changes
                      </Button>
                      <Button
                        onClick={handleUpdateInfluencer}
                        disabled={modalLoading}
                        className="flex-1 h-14 rounded-2xl font-bold text-xs uppercase tracking-widest bg-slate-900 text-white shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {modalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Updates"}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};

// Export as dynamic component to prevent prerendering issues
export default dynamic(() => Promise.resolve(InfluencersPage), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  ),
});
