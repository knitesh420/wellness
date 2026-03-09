"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Edit,
  Loader2,
  Camera,
  Plus,
  X,
  Languages,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Redux Imports
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import {
  fetchDoctorSettings,
  updateProfileSettings,
  updateBusinessSettings,
  updateSecuritySettings,
  selectDoctorSettings,
  selectDoctorSettingsLoading,
  selectDoctorSettingsSaving,
  selectDoctorSettingsError,
} from "@/lib/redux/features/doctorSettingsSlice";

// Doctor Settings Page Component
const DoctorSettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const settingsData = useSelector(selectDoctorSettings);
  const isLoading = useSelector(selectDoctorSettingsLoading);
  const isSaving = useSelector(selectDoctorSettingsSaving);
  const error = useSelector(selectDoctorSettingsError);

  const [editStates, setEditStates] = useState({
    profile: false,
    business: false,
    security: false,
  });

  const [formData, setFormData] = useState(
    settingsData || {
      profile: {
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialization: "",
        experience: 0,
        qualifications: "",
        license: "",
        hospital: "",
        location: "",
        bio: "",
        avatar: "",
        languages: [],
        consultationFee: 0,
        emergencyFee: 0,
        gender: "",
        dateOfBirth: "",
      },
      business: {
        clinicName: "",
        clinicAddress: "",
        clinicPhone: "",
        clinicEmail: "",
        website: "",
        taxId: "",
        businessType: "Private Practice",
        operatingHours: {
          monday: { start: "09:00", end: "17:00", closed: false },
          tuesday: { start: "09:00", end: "17:00", closed: false },
          wednesday: { start: "09:00", end: "17:00", closed: false },
          thursday: { start: "09:00", end: "17:00", closed: false },
          friday: { start: "09:00", end: "17:00", closed: false },
          saturday: { start: "10:00", end: "14:00", closed: false },
          sunday: { start: "00:00", end: "00:00", closed: true },
        },
        appointmentDuration: 30,
        maxPatientsPerDay: 20,
        emergencyAvailability: true,
      },
      security: {
        twoFactorAuth: false,
        loginAlerts: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        ipWhitelist: [],
        auditLogs: true,
        dataEncryption: true,
        backupFrequency: "daily",
      },
    },
  );

  const [successMessage, setSuccessMessage] = useState("");

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchDoctorSettings());
  }, [dispatch]);

  // Update form data when settings are fetched
  useEffect(() => {
    if (settingsData) {
      setFormData(settingsData);
    }
  }, [settingsData]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Show loader while fetching
  if (isLoading && !settingsData) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleEdit = (section: string) => {
    setEditStates((prev) => ({ ...prev, [section]: true }));
  };

  const handleCancel = (section: string) => {
    setEditStates((prev) => ({ ...prev, [section]: false }));
    if (settingsData) {
      setFormData(settingsData);
    }
  };

  const handleSave = async (section: string) => {
    try {
      if (section === "profile") {
        await dispatch(updateProfileSettings(formData.profile as any)).unwrap();
      } else if (section === "business") {
        await dispatch(
          updateBusinessSettings(formData.business as any),
        ).unwrap();
      } else if (section === "security") {
        await dispatch(
          updateSecuritySettings(formData.security as any),
        ).unwrap();
      }
      setEditStates((prev) => ({ ...prev, [section]: false }));
      setSuccessMessage(
        `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully!`,
      );
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  const handleInputChange = (
    section: string,
    field: string,
    value: string | number | boolean | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (
    section: string,
    parentField: string,
    childField: string,
    value: string | number | boolean | object,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [parentField]: {
          ...(((prev[section as keyof typeof prev] as unknown) as Record<string, unknown>)[
            parentField
          ] as Record<string, unknown>),
          [childField]: value,
        },
      },
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your professional profile, clinical business, and account security
          </p>
        </div>
      </div>

      {/* Status Messages */}
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive" className="rounded-xl border-red-100 bg-red-50/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="rounded-xl border-emerald-100 bg-emerald-50/50">
            <AlertDescription className="font-semibold text-emerald-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs defaultValue="profile" className="w-full space-y-8">
        <TabsList className="bg-slate-100/80 p-1 rounded-xl h-12 border border-slate-200/50 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <TabsTrigger value="profile" className="rounded-lg px-8 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Profile</TabsTrigger>
          <TabsTrigger value="business" className="rounded-lg px-8 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Business</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg px-8 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 animate-in fade-in duration-500">
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-900">Profile information</CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Update your personal and professional identity across the network
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {editStates.profile ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleCancel("profile")}
                        disabled={isSaving}
                        className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSave("profile")}
                        disabled={isSaving}
                        className="h-10 px-6 rounded-xl font-bold shadow-lg shadow-indigo-100"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleEdit("profile")}
                      className="h-10 px-6 rounded-xl font-bold shadow-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit profile
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Profile Picture */}
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                    <AvatarImage
                      src={formData.profile.avatar}
                      alt={formData.profile.name || "Doctor"}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-black bg-indigo-50 text-indigo-400">
                      {(formData.profile.name || "D")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {editStates.profile && (
                    <button className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Profile photo</h4>
                  <p className="text-xs text-slate-500 max-w-[200px]">
                    Recommended: 800x800px. JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-1">Full name</Label>
                  <Input
                    id="name"
                    value={formData.profile.name}
                    onChange={(e) =>
                      handleInputChange("profile", "name", e.target.value)
                    }
                    disabled={!editStates.profile}
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.profile.email}
                    onChange={(e) =>
                      handleInputChange("profile", "email", e.target.value)
                    }
                    disabled={!editStates.profile}
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 ml-1">Phone number</Label>
                  <Input
                    id="phone"
                    value={formData.profile.phone}
                    onChange={(e) =>
                      handleInputChange("profile", "phone", e.target.value)
                    }
                    disabled={!editStates.profile}
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-sm font-semibold text-slate-700 ml-1">Medical specialization</Label>
                  <Select
                    value={formData.profile.specialization}
                    onValueChange={(value) =>
                      handleInputChange("profile", "specialization", value)
                    }
                    disabled={!editStates.profile}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 disabled:opacity-60 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-semibold text-slate-700 ml-1">Years of experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.profile.experience}
                    onChange={(e) =>
                      handleInputChange(
                        "profile",
                        "experience",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    disabled={!editStates.profile}
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license" className="text-sm font-semibold text-slate-700 ml-1">Medical license number</Label>
                  <Input
                    id="license"
                    value={formData.profile.license}
                    onChange={(e) =>
                      handleInputChange("profile", "license", e.target.value)
                    }
                    disabled={!editStates.profile}
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital" className="text-sm font-semibold text-slate-700 ml-1">Current hospital/clinic</Label>
                  <Input
                    id="hospital"
                    value={formData.profile.hospital}
                    onChange={(e) =>
                      handleInputChange("profile", "hospital", e.target.value)
                    }
                    disabled={!editStates.profile}
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold text-slate-700 ml-1">Work location</Label>
                  <Input
                    id="location"
                    value={formData.profile.location}
                    onChange={(e) =>
                      handleInputChange("profile", "location", e.target.value)
                    }
                    disabled={!editStates.profile}
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications" className="text-sm font-semibold text-slate-700 ml-1">Education & qualifications</Label>
                <Input
                  id="qualifications"
                  value={formData.profile.qualifications}
                  onChange={(e) =>
                    handleInputChange(
                      "profile",
                      "qualifications",
                      e.target.value,
                    )
                  }
                  disabled={!editStates.profile}
                  className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-semibold text-slate-700 ml-1">Professional bio</Label>
                <Textarea
                  id="bio"
                  value={formData.profile.bio}
                  onChange={(e) =>
                    handleInputChange("profile", "bio", e.target.value)
                  }
                  disabled={!editStates.profile}
                  rows={4}
                  className="rounded-2xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50 p-4 leading-relaxed"
                />
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-slate-700 ml-1">Languages spoken</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.profile.languages.map((language, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider border-none"
                    >
                      <Languages className="w-3.5 h-3.5 text-slate-400" />
                      {language}
                      {editStates.profile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 hover:bg-slate-200 text-slate-400"
                          onClick={() => {
                            const newLanguages =
                              formData.profile.languages.filter(
                                (_, i) => i !== index,
                              );
                            handleInputChange(
                              "profile",
                              "languages",
                              newLanguages,
                            );
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                  {editStates.profile && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg border-slate-200 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50"
                      onClick={() => {
                        const newLanguage = prompt("Enter language (e.g. Hindi, Spanish):");
                        if (newLanguage) {
                          handleInputChange("profile", "languages", [
                            ...formData.profile.languages,
                            newLanguage,
                          ]);
                        }
                      }}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Add language
                    </Button>
                  )}
                </div>
              </div>

              {/* Consultation Fees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Save className="w-4 h-4 text-indigo-600" />
                    </div>
                    <Label htmlFor="consultationFee" className="text-sm font-bold text-slate-900">Regular fee</Label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                    <Input
                      id="consultationFee"
                      type="number"
                      value={formData.profile.consultationFee}
                      onChange={(e) =>
                        handleInputChange(
                          "profile",
                          "consultationFee",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      disabled={!editStates.profile}
                      className="h-11 pl-10 rounded-xl border-slate-200 bg-white font-bold text-indigo-600 focus:border-indigo-500/30"
                    />
                  </div>
                </div>
                <div className="p-6 bg-red-50/30 rounded-2xl border border-red-50 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <Label htmlFor="emergencyFee" className="text-sm font-bold text-slate-900">Emergency fee</Label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                    <Input
                      id="emergencyFee"
                      type="number"
                      value={formData.profile.emergencyFee}
                      onChange={(e) =>
                        handleInputChange(
                          "profile",
                          "emergencyFee",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      disabled={!editStates.profile}
                      className="h-11 pl-10 rounded-xl border-slate-200 bg-white font-bold text-red-600 focus:border-indigo-500/30"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6 animate-in fade-in duration-500">
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-900">Business details</CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Manage your clinical facilities and operational parameters
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {editStates.business ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleCancel("business")}
                        disabled={isSaving}
                        className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSave("business")}
                        disabled={isSaving}
                        className="h-10 px-6 rounded-xl font-bold shadow-lg shadow-emerald-100 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleEdit("business")}
                      className="h-10 px-6 rounded-xl font-bold shadow-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit business
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="clinicName" className="text-sm font-semibold text-slate-700 ml-1">Clinic name</Label>
                  <Input
                    id="clinicName"
                    value={formData.business.clinicName}
                    onChange={(e) =>
                      handleInputChange(
                        "business",
                        "clinicName",
                        e.target.value,
                      )
                    }
                    disabled={!editStates.business}
                    className="h-11 rounded-xl border-slate-200 focus:border-emerald-500/30 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-sm font-semibold text-slate-700 ml-1">Business type</Label>
                  <Select
                    value={formData.business.businessType}
                    onValueChange={(value) =>
                      handleInputChange("business", "businessType", value)
                    }
                    disabled={!editStates.business}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-emerald-500/30 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Private Practice">Private Practice</SelectItem>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                      <SelectItem value="Clinic">Clinic</SelectItem>
                      <SelectItem value="Group Practice">Group Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicPhone" className="text-sm font-semibold text-slate-700 ml-1">Clinic phone</Label>
                  <Input
                    id="clinicPhone"
                    value={formData.business.clinicPhone}
                    onChange={(e) =>
                      handleInputChange(
                        "business",
                        "clinicPhone",
                        e.target.value,
                      )
                    }
                    disabled={!editStates.business}
                    className="h-11 rounded-xl border-slate-200 focus:border-emerald-500/30 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicEmail" className="text-sm font-semibold text-slate-700 ml-1">Clinic email</Label>
                  <Input
                    id="clinicEmail"
                    type="email"
                    value={formData.business.clinicEmail}
                    onChange={(e) =>
                      handleInputChange(
                        "business",
                        "clinicEmail",
                        e.target.value,
                      )
                    }
                    disabled={!editStates.business}
                    className="h-11 rounded-xl border-slate-200 focus:border-emerald-500/30 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-semibold text-slate-700 ml-1">Business website</Label>
                  <Input
                    id="website"
                    value={formData.business.website}
                    onChange={(e) =>
                      handleInputChange("business", "website", e.target.value)
                    }
                    disabled={!editStates.business}
                    className="h-11 rounded-xl border-slate-200 focus:border-emerald-500/30 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId" className="text-sm font-semibold text-slate-700 ml-1">Tax ID / GSTIN</Label>
                  <Input
                    id="taxId"
                    value={formData.business.taxId}
                    onChange={(e) =>
                      handleInputChange("business", "taxId", e.target.value)
                    }
                    disabled={!editStates.business}
                    className="h-11 rounded-xl border-slate-200 focus:border-emerald-500/30 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicAddress" className="text-sm font-semibold text-slate-700 ml-1">Clinic address</Label>
                <Textarea
                  id="clinicAddress"
                  value={formData.business.clinicAddress}
                  onChange={(e) =>
                    handleInputChange(
                      "business",
                      "clinicAddress",
                      e.target.value,
                    )
                  }
                  disabled={!editStates.business}
                  rows={3}
                  className="rounded-2xl border-slate-200 focus:border-emerald-500/30 p-4 leading-relaxed font-medium"
                />
              </div>

              <Separator className="bg-slate-100" />

              {/* Operating Hours */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Save className="w-4 h-4 text-emerald-600" />
                  </div>
                  <Label className="text-base font-bold text-slate-900">Operating hours</Label>
                </div>

                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(formData.business.operatingHours).map(
                    ([day, hours]) => (
                      <div key={day} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100">
                        <div className="w-24 text-sm font-bold capitalize text-slate-700">
                          {day}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 mr-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {hours.closed ? "Closed" : "Open"}
                            </span>
                            <Switch
                              checked={!hours.closed}
                              onCheckedChange={(checked) =>
                                handleNestedInputChange(
                                  "business",
                                  "operatingHours",
                                  day,
                                  {
                                    ...hours,
                                    closed: !checked,
                                  },
                                )
                              }
                              disabled={!editStates.business}
                            />
                          </div>
                          {!hours.closed && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={hours.start}
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "business",
                                    "operatingHours",
                                    day,
                                    {
                                      ...hours,
                                      start: e.target.value,
                                    },
                                  )
                                }
                                disabled={!editStates.business}
                                className="w-28 h-9 rounded-lg border-slate-200 text-xs font-bold"
                              />
                              <span className="text-slate-400 font-medium tracking-widest text-[10px]">TO</span>
                              <Input
                                type="time"
                                value={hours.end}
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "business",
                                    "operatingHours",
                                    day,
                                    {
                                      ...hours,
                                      end: e.target.value,
                                    },
                                  )
                                }
                                disabled={!editStates.business}
                                className="w-28 h-9 rounded-lg border-slate-200 text-xs font-bold"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-50 space-y-3">
                  <Label className="text-xs font-black uppercase tracking-wider text-slate-400">Appt. duration (min)</Label>
                  <Input
                    type="number"
                    value={formData.business.appointmentDuration}
                    onChange={(e) =>
                      handleInputChange("business", "appointmentDuration", parseInt(e.target.value) || 0)
                    }
                    disabled={!editStates.business}
                    className="h-10 rounded-xl border-slate-200 font-bold text-indigo-600 bg-white"
                  />
                </div>
                <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-50 space-y-3">
                  <Label className="text-xs font-black uppercase tracking-wider text-slate-400">Max patients per day</Label>
                  <Input
                    type="number"
                    value={formData.business.maxPatientsPerDay}
                    onChange={(e) =>
                      handleInputChange("business", "maxPatientsPerDay", parseInt(e.target.value) || 0)
                    }
                    disabled={!editStates.business}
                    className="h-10 rounded-xl border-slate-200 font-bold text-indigo-600 bg-white"
                  />
                </div>
                <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-50 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase tracking-wider text-slate-400">Emergency support</Label>
                    <p className="text-[10px] text-slate-500 font-medium">Available for urgent care</p>
                  </div>
                  <Switch
                    checked={formData.business.emergencyAvailability}
                    onCheckedChange={(checked) =>
                      handleInputChange("business", "emergencyAvailability", checked)
                    }
                    disabled={!editStates.business}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 animate-in fade-in duration-500">
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-900">Security & Privacy</CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Protect your account and patient data with advanced security settings
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {editStates.security ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleCancel("security")}
                        disabled={isSaving}
                        className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSave("security")}
                        disabled={isSaving}
                        className="h-10 px-6 rounded-xl font-bold shadow-lg shadow-slate-100 bg-slate-900 hover:bg-black text-white"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save security
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleEdit("security")}
                      className="h-10 px-6 rounded-xl font-bold shadow-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Adjust security
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold text-slate-900">Two-factor authentication</Label>
                    <p className="text-xs text-slate-500 font-medium">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={formData.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      handleInputChange("security", "twoFactorAuth", checked)
                    }
                    disabled={!editStates.security}
                  />
                </div>
                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold text-slate-900">Login alerts</Label>
                    <p className="text-xs text-slate-500 font-medium">Receive notifications for new login attempts</p>
                  </div>
                  <Switch
                    checked={formData.security.loginAlerts}
                    onCheckedChange={(checked) =>
                      handleInputChange("security", "loginAlerts", checked)
                    }
                    disabled={!editStates.security}
                  />
                </div>
                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold text-slate-900">Audit logs</Label>
                    <p className="text-xs text-slate-500 font-medium">Record all administrative actions in the system</p>
                  </div>
                  <Switch
                    checked={formData.security.auditLogs}
                    onCheckedChange={(checked) =>
                      handleInputChange("security", "auditLogs", checked)
                    }
                    disabled={!editStates.security}
                  />
                </div>
                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold text-slate-900">Data encryption</Label>
                    <p className="text-xs text-slate-500 font-medium">Encrypt all medical records and shared files</p>
                  </div>
                  <Switch
                    checked={formData.security.dataEncryption}
                    onCheckedChange={(checked) =>
                      handleInputChange("security", "dataEncryption", checked)
                    }
                    disabled={!editStates.security}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              </div>

              <Separator className="bg-slate-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 ml-1">Session timeout (minutes)</Label>
                  <Select
                    value={formData.security.sessionTimeout.toString()}
                    onValueChange={(value) =>
                      handleInputChange("security", "sessionTimeout", parseInt(value))
                    }
                    disabled={!editStates.security}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 ml-1">Backup frequency</Label>
                  <Select
                    value={formData.security.backupFrequency}
                    onValueChange={(value) =>
                      handleInputChange("security", "backupFrequency", value)
                    }
                    disabled={!editStates.security}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="hourly">Every hour</SelectItem>
                      <SelectItem value="daily">Daily backup</SelectItem>
                      <SelectItem value="weekly">Weekly backup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorSettingsPage;
