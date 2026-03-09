"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Grid3X3,
  List,
  Edit,
  Trash2,
  Users,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  MessageSquare,
  Calendar,
  Mail,
} from "lucide-react";
import Swal from "sweetalert2";
import { getApiV1Url } from "@/lib/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import Loader from "@/components/common/dashboard/Loader";
import Error from "@/components/common/dashboard/Error";
import NoData from "@/components/common/dashboard/NoData";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}

const LeadsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Contact> | null>(null);

  // Helper to get auth token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      let token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken") ||
        "";
      return token.replace(/^"|"$/g, "");
    }
    return "";
  };

  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(getApiV1Url("/contacts"), {
        headers,
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setContacts(data.data);
      } else {
        setError(data.message || "Failed to fetch contacts");
      }
    } catch (err) {
      setError("Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Client-side filtering
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.phone.includes(searchLower) ||
      contact.message.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalItems = filteredContacts.length;
  const totalPages = Math.ceil(totalItems / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + pagination.limit,
  );

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Reset page when search changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchTerm]);

  const handleUpdateContact = async (
    contactId: string,
    updatedData: Partial<Contact>,
  ) => {
    setModalLoading(true);
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(getApiV1Url(`/contacts/${contactId}`), {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success) {
        fetchContacts();
        setShowEditModal(false);
        Swal.fire({
          title: "Success!",
          text: "Contact updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update contact.",
        icon: "error",
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    setModalLoading(true);
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(getApiV1Url(`/contacts/${selectedContact._id}`), {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        fetchContacts();
        setShowDeleteModal(false);
        setSelectedContact(null);
        Swal.fire({
          title: "Deleted!",
          text: "The contact has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete contact.",
        icon: "error",
      });
    } finally {
      setModalLoading(false);
    }
  };

  const openViewModal = (contact: Contact) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setEditForm({ ...contact });
    setShowEditModal(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-8 p-1">
        {error ? (
          <Error title="Error loading contacts" message={error} />
        ) : (
          <>
            {/* Header section with refined typography */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Inquiry Management
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Manage incoming customer leads and contact submissions
                </p>
              </div>
            </div>

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total inquiries", value: contacts.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
                {
                  label: "Procured this month",
                  value: contacts.filter((c) => {
                    const date = new Date(c.createdAt);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length,
                  icon: Calendar,
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                { label: "Phone vectors", value: contacts.filter((c) => c.phone).length, icon: Phone, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Email channels", value: contacts.filter((c) => c.email).length, icon: Mail, color: "text-amber-600", bg: "bg-amber-50" },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                  <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type="text"
                      placeholder="Search inquiries by name, email, or message..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-11 pl-11 rounded-xl bg-slate-50 border-transparent focus:border-indigo-500/30 focus:bg-white transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
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
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`h-9 px-4 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    >
                      <List className="w-4 h-4 mr-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">List</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Content Display */}
            {isLoading ? (
              <Loader variant="skeleton" message="Accessing database..." />
            ) : filteredContacts.length === 0 ? (
              <NoData
                message="No inquiries recovered"
                description="The registry contains no records matching your current filter parameters."
                icon={<MessageSquare className="w-full h-full text-slate-200" />}
                size="lg"
              />
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedContacts.map((contact: Contact) => (
                      <Card
                        key={contact._id}
                        className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-[24px] bg-white overflow-hidden flex flex-col h-full"
                      >
                        <CardHeader className="pb-4 pt-6 px-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 min-w-0">
                              <CardTitle className="text-xl font-bold text-slate-900 truncate tracking-tight">
                                {contact.name}
                              </CardTitle>
                              <CardDescription className="text-xs font-medium text-indigo-500 truncate flex items-center gap-1.5 uppercase tracking-wide">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="h-6 rounded-lg px-2 bg-slate-50 border-slate-100 text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">
                              <Clock className="w-3 h-3 mr-1 text-slate-400" />
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 flex flex-col px-6 pb-6 pt-0">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Phone Vector
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                {contact.phone || "UNSPECIFIED"}
                              </span>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-2xl text-sm text-slate-600 line-clamp-3 leading-relaxed border border-slate-50 italic font-medium">
                              &quot;{contact.message}&quot;
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4 mt-auto">
                            <Button
                              onClick={() => openViewModal(contact)}
                              className="flex-1 h-10 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              variant="outline"
                            >
                              <Eye className="w-4 h-4" />
                              Inquiry
                            </Button>
                            <Button
                              onClick={() => openEditModal(contact)}
                              className="flex-1 h-10 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
                            >
                              <Edit className="w-4 h-4" />
                              Adjust
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-100/50 hover:bg-transparent">
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Requester Identity</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Connection Strings</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Intelligence Payload</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedContacts.map((contact: Contact) => (
                          <TableRow key={contact._id} className="border-slate-100/50 group transition-colors hover:bg-slate-50/50">
                            <TableCell className="py-4 px-6">
                              <span className="font-bold text-slate-900">{contact.name}</span>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-indigo-600">{contact.email}</span>
                                <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">{contact.phone || "---"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <p className="text-xs font-medium text-slate-500 truncate max-w-[300px] italic">
                                &quot;{contact.message}&quot;
                              </p>
                            </TableCell>
                            <TableCell className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => openViewModal(contact)}
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Inquiry</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => openEditModal(contact)}
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit Record</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => openDeleteModal(contact)}
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete Record</TooltipContent>
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
                {!isLoading && filteredContacts.length > 0 && totalPages > 1 && (
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
                        className="h-10 px-4 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1 mx-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={pagination.page === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${pagination.page === page ? 'bg-slate-900 shadow-lg' : 'border-slate-200'}`}
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
                        className="h-10 px-4 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* View Lead Modal */}
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
              <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-[32px] bg-white/95 backdrop-blur-xl">
                <DialogHeader className="px-8 pt-8 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-2xl">
                      <MessageSquare className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Inquiry intelligence</DialogTitle>
                      <DialogDescription className="text-slate-500 mt-1">Review incoming lead data and verify contact vectors</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {selectedContact && (
                  <div className="px-8 pb-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    {/* Identity Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FullName</p>
                        <p className="text-lg font-bold text-slate-900">{selectedContact.name}</p>
                      </div>
                      <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email address</p>
                        <p className="text-sm font-semibold text-indigo-600 truncate">{selectedContact.email}</p>
                      </div>
                      <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone number</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedContact.phone || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="h-9 px-4 rounded-xl bg-indigo-50/30 border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 mr-2" />
                        Procured: {new Date(selectedContact.createdAt).toLocaleString()}
                      </Badge>
                      <Badge variant="outline" className="h-9 px-4 rounded-xl bg-slate-50/50 border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 mr-2" />
                        Registry ID: {selectedContact._id.slice(-8).toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-100" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Message payload</span>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>
                      <div className="p-8 bg-slate-50/30 rounded-[32px] border border-slate-100/50 italic">
                        <p className="text-slate-600 leading-relaxed font-medium">
                          &quot;{selectedContact.message}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-white transition-all"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close record
                  </Button>
                  <Button
                    onClick={() => {
                      setShowViewModal(false);
                      openEditModal(selectedContact!);
                    }}
                    className="flex-1 h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all"
                  >
                    Calibrate record
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Lead Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent className="max-w-xl p-0 overflow-hidden border-none shadow-2xl rounded-[32px] bg-white/95 backdrop-blur-xl">
                <DialogHeader className="px-8 pt-8 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-2xl">
                      <Edit className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Edit inquiry</DialogTitle>
                      <DialogDescription className="text-slate-500 mt-1">Refine inquiry parameters and maintain record integrity</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {editForm && (
                  <div className="px-8 pb-8 space-y-6">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 ml-1">Full name</Label>
                        <Input
                          className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium bg-white"
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 ml-1">Email address</Label>
                        <Input
                          className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium bg-white"
                          value={editForm.email || ""}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 ml-1">Phone number</Label>
                        <Input
                          className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium bg-white"
                          value={editForm.phone || ""}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 ml-1">Message content</Label>
                        <Textarea
                          className="min-h-[120px] rounded-2xl border-slate-200 focus:border-indigo-500/30 font-medium bg-white p-4 resize-none leading-relaxed"
                          value={editForm.message || ""}
                          onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                        />
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
                    Discard changes
                  </Button>
                  <Button
                    onClick={() => handleUpdateContact(selectedContact!._id, editForm!)}
                    disabled={modalLoading}
                    className="flex-1 h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all"
                  >
                    {modalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
              <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-[32px] bg-white/95 backdrop-blur-xl">
                <DialogHeader className="px-8 pt-8 pb-4 text-center">
                  <div className="mx-auto p-4 bg-rose-50 rounded-full w-fit mb-4">
                    <Trash2 className="w-8 h-8 text-rose-600" />
                  </div>
                  <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Delete record</DialogTitle>
                  <DialogDescription className="text-slate-500 mt-2 px-4 italic leading-relaxed">
                    This will permanently eliminate the inquiry from the registry. This action cannot be reversed.
                  </DialogDescription>
                </DialogHeader>

                <div className="px-8 py-6">
                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50 text-center">
                    <p className="text-sm font-bold text-slate-700">
                      Confirm deletion of <span className="text-rose-600 italic">"{selectedContact?.name}"</span>?
                    </p>
                  </div>
                </div>

                <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-white transition-all"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={modalLoading}
                  >
                    Keep record
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteContact}
                    disabled={modalLoading}
                    className="flex-1 h-12 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all"
                  >
                    {modalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};

export default LeadsPage;
