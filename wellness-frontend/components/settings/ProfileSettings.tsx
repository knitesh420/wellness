'use client'

import React from 'react'
import { User, Upload, Edit, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Image from 'next/image'


interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  bio: string
}

interface ProfileSettingsProps {
  profileData: ProfileData
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>
  editStates: { profile: boolean }
  isLoading: boolean
  onEdit: (section: string) => void
  onCancel: (section: string) => void
  onSave: (section: string) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profileData,
  setProfileData,
  editStates,
  isLoading,
  onEdit,
  onCancel,
  onSave,
  onImageUpload
}) => {
  return (
    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Profile information</CardTitle>
            <CardDescription className="text-sm text-slate-500">Update your personal details and public identity</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!editStates.profile ? (
              <Button
                onClick={() => onEdit('profile')}
                className="h-10 px-6 rounded-xl font-bold shadow-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onCancel('profile')}
                  variant="outline"
                  disabled={isLoading}
                  className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSave('profile')}
                  disabled={isLoading}
                  className="h-10 px-6 rounded-xl font-bold shadow-lg shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 ring-1 ring-slate-100">
              {profileData.avatar ? (
                <Image
                  src={profileData.avatar}
                  alt={profileData.firstName || "Profile"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                  <User className="w-10 h-10 text-indigo-400 font-black" />
                </div>
              )}
            </div>
            {editStates.profile && (
              <div className="absolute inset-0 w-full h-full rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-none">
                <Upload className="w-6 h-6 text-white" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onImageUpload(e, 'avatar')}
              disabled={!editStates.profile}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
          <div className="text-center sm:text-left space-y-2">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Profile photo</h4>
            <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
              Recommended: 800x800px. JPG, PNG or GIF. Max size 2MB.
            </p>
            {editStates.profile && (
              <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 mt-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50">
                <Upload className="w-3 h-3 mr-1.5" />
                Upload photo
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700 ml-1">First name</Label>
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              disabled={!editStates.profile}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700 ml-1">Last name</Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              disabled={!editStates.profile}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">Email address</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              disabled={!editStates.profile}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 ml-1">Phone number</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              disabled={!editStates.profile}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-semibold text-slate-700 ml-1">Personal bio</Label>
          <Textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            rows={4}
            disabled={!editStates.profile}
            className="rounded-2xl border-slate-200 focus:border-indigo-500/30 transition-all font-medium disabled:opacity-60 disabled:bg-slate-50/50 p-4 leading-relaxed"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileSettings
