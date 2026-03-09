'use client'

import React from 'react'
import { Edit, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface BusinessData {
  businessName: string
  businessEmail: string
  businessPhone: string
  businessAddress: string
  gstNumber: string
  panNumber: string
  businessType: string
  industry: string
  foundedYear: string
  website: string
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
  }
}

interface BusinessSettingsProps {
  businessData: BusinessData
  setBusinessData: React.Dispatch<React.SetStateAction<BusinessData>>
  editStates: { business: boolean }
  isLoading: boolean
  onEdit: (section: string) => void
  onCancel: (section: string) => void
  onSave: (section: string) => void
}

const BusinessSettings: React.FC<BusinessSettingsProps> = ({
  businessData,
  setBusinessData,
  editStates,
  isLoading,
  onEdit,
  onCancel,
  onSave
}) => {
  return (
    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Business information</CardTitle>
            <CardDescription className="text-sm text-slate-500">Manage your business details and legal identification</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!editStates.business ? (
              <Button
                onClick={() => onEdit('business')}
                className="h-10 px-6 rounded-xl font-bold shadow-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit business
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onCancel('business')}
                  variant="outline"
                  disabled={isLoading}
                  className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSave('business')}
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
      <CardContent className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-sm font-semibold text-slate-700 ml-1">Business name</Label>
            <Input
              id="businessName"
              value={businessData.businessName}
              onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
              disabled={!editStates.business}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessEmail" className="text-sm font-semibold text-slate-700 ml-1">Business email</Label>
            <Input
              id="businessEmail"
              type="email"
              value={businessData.businessEmail}
              onChange={(e) => setBusinessData({ ...businessData, businessEmail: e.target.value })}
              disabled={!editStates.business}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessPhone" className="text-sm font-semibold text-slate-700 ml-1">Business phone</Label>
            <Input
              id="businessPhone"
              value={businessData.businessPhone}
              onChange={(e) => setBusinessData({ ...businessData, businessPhone: e.target.value })}
              disabled={!editStates.business}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-semibold text-slate-700 ml-1">Website</Label>
            <Input
              id="website"
              value={businessData.website}
              onChange={(e) => setBusinessData({ ...businessData, website: e.target.value })}
              disabled={!editStates.business}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessAddress" className="text-sm font-semibold text-slate-700 ml-1">Business address</Label>
          <Textarea
            id="businessAddress"
            value={businessData.businessAddress}
            onChange={(e) => setBusinessData({ ...businessData, businessAddress: e.target.value })}
            rows={3}
            disabled={!editStates.business}
            className="rounded-2xl border-slate-200 focus:border-indigo-500/30 p-4 leading-relaxed font-medium disabled:opacity-60"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <Label htmlFor="gstNumber" className="text-sm font-semibold text-slate-700 ml-1">Gst number</Label>
            <Input
              id="gstNumber"
              value={businessData.gstNumber}
              onChange={(e) => setBusinessData({ ...businessData, gstNumber: e.target.value })}
              placeholder="27ABCDE1234F1Z5"
              disabled={!editStates.business}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="panNumber" className="text-sm font-semibold text-slate-700 ml-1">Pan number</Label>
            <Input
              id="panNumber"
              value={businessData.panNumber}
              onChange={(e) => setBusinessData({ ...businessData, panNumber: e.target.value })}
              placeholder="ABCDE1234F"
              disabled={!editStates.business}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType" className="text-sm font-semibold text-slate-700 ml-1">Business type</Label>
            <Select
              value={businessData.businessType}
              onValueChange={(value) => setBusinessData({ ...businessData, businessType: value })}
              disabled={!editStates.business}
            >
              <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Private Limited">Private Limited</SelectItem>
                <SelectItem value="Public Limited">Public Limited</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                <SelectItem value="LLP">Limited Liability Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="foundedYear" className="text-sm font-semibold text-slate-700 ml-1">Founded year</Label>
            <Input
              id="foundedYear"
              value={businessData.foundedYear}
              onChange={(e) => setBusinessData({ ...businessData, foundedYear: e.target.value })}
              placeholder="2020"
              disabled={!editStates.business}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
            />
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <span className="text-xs font-bold text-indigo-600">@</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Social media links</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-sm font-semibold text-slate-700 ml-1">Facebook</Label>
              <Input
                id="facebook"
                value={businessData.socialMedia.facebook}
                onChange={(e) => setBusinessData({
                  ...businessData,
                  socialMedia: { ...businessData.socialMedia, facebook: e.target.value }
                })}
                placeholder="https://facebook.com/yourpage"
                disabled={!editStates.business}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm font-semibold text-slate-700 ml-1">Instagram</Label>
              <Input
                id="instagram"
                value={businessData.socialMedia.instagram}
                onChange={(e) => setBusinessData({
                  ...businessData,
                  socialMedia: { ...businessData.socialMedia, instagram: e.target.value }
                })}
                placeholder="https://instagram.com/yourpage"
                disabled={!editStates.business}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-sm font-semibold text-slate-700 ml-1">Twitter</Label>
              <Input
                id="twitter"
                value={businessData.socialMedia.twitter}
                onChange={(e) => setBusinessData({
                  ...businessData,
                  socialMedia: { ...businessData.socialMedia, twitter: e.target.value }
                })}
                placeholder="https://twitter.com/yourpage"
                disabled={!editStates.business}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm font-semibold text-slate-700 ml-1">LinkedIn</Label>
              <Input
                id="linkedin"
                value={businessData.socialMedia.linkedin}
                onChange={(e) => setBusinessData({
                  ...businessData,
                  socialMedia: { ...businessData.socialMedia, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/company/yourcompany"
                disabled={!editStates.business}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BusinessSettings
