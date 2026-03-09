'use client'

import React from 'react'
import { Edit, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

interface NotificationData {
  emailNotifications: {
    orderUpdates: boolean
    newOrders: boolean
    lowStock: boolean
    customerReviews: boolean
    marketingEmails: boolean
    systemAlerts: boolean
  }
  smsNotifications: {
    orderUpdates: boolean
    newOrders: boolean
    lowStock: boolean
    systemAlerts: boolean
  }
  pushNotifications: {
    orderUpdates: boolean
    newOrders: boolean
    lowStock: boolean
    customerReviews: boolean
    systemAlerts: boolean
  }
}

interface NotificationSettingsProps {
  notificationData: NotificationData
  setNotificationData: React.Dispatch<React.SetStateAction<NotificationData>>
  editStates: { notifications: boolean }
  isLoading: boolean
  onEdit: (section: string) => void
  onCancel: (section: string) => void
  onSave: (section: string) => void
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notificationData,
  setNotificationData,
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
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Notification preferences</CardTitle>
            <CardDescription className="text-sm text-slate-500">Choose how and when you want to be notified about store activity</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!editStates.notifications ? (
              <Button
                onClick={() => onEdit('notifications')}
                className="h-10 px-6 rounded-xl font-bold shadow-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit notifications
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onCancel('notifications')}
                  variant="outline"
                  disabled={isLoading}
                  className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSave('notifications')}
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
        {/* Email Notifications */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <span className="text-indigo-600 font-bold text-xs uppercase">Email</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Email notifications</h3>
          </div>
          <div className="grid grid-cols-1 divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
            {Object.entries(notificationData.emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1 pr-4">
                  <Label className="text-sm font-semibold text-slate-800">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('Sms', 'SMS')}
                  </Label>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                    {key === 'orderUpdates' && 'Get notified when an order status changes (e.g., shipped, delivered)'}
                    {key === 'newOrders' && 'Receive an email alert as soon as a customer places a new order'}
                    {key === 'lowStock' && 'Get warned when product inventory levels drop below your threshold'}
                    {key === 'customerReviews' && 'Receive notifications for new product reviews or ratings'}
                    {key === 'marketingEmails' && 'Get promotional emails, platform updates, and newsletters'}
                    {key === 'systemAlerts' && 'Receive critical system notifications regarding your account'}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked: boolean) => setNotificationData({
                    ...notificationData,
                    emailNotifications: {
                      ...notificationData.emailNotifications,
                      [key]: checked
                    }
                  })}
                  disabled={!editStates.notifications}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* SMS Notifications */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <span className="text-emerald-600 font-bold text-xs uppercase">SMS</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">SMS notifications</h3>
          </div>
          <div className="grid grid-cols-1 divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
            {Object.entries(notificationData.smsNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1 pr-4">
                  <Label className="text-sm font-semibold text-slate-800">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                    {key === 'orderUpdates' && 'Get real-time SMS updates for order status changes'}
                    {key === 'newOrders' && 'Receive instant SMS alerts for new customer orders'}
                    {key === 'lowStock' && 'Get notified via SMS when items are running out of stock'}
                    {key === 'systemAlerts' && 'Receive urgent system maintenance or security alerts via SMS'}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked: boolean) => setNotificationData({
                    ...notificationData,
                    smsNotifications: {
                      ...notificationData.smsNotifications,
                      [key]: checked
                    }
                  })}
                  disabled={!editStates.notifications}
                  className="data-[state=checked]:bg-emerald-600"
                />
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Push Notifications */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <span className="text-amber-600 font-bold text-xs uppercase">Push</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Push notifications</h3>
          </div>
          <div className="grid grid-cols-1 divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
            {Object.entries(notificationData.pushNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1 pr-4">
                  <Label className="text-sm font-semibold text-slate-800">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                    {key === 'orderUpdates' && 'Get browser push notifications for order status changes'}
                    {key === 'newOrders' && 'Receive push alerts for new sales as they happen'}
                    {key === 'lowStock' && 'Get warned via push notifications for low inventory items'}
                    {key === 'customerReviews' && 'Receive push alerts for new customer feedback and reviews'}
                    {key === 'systemAlerts' && 'Get important system and performance alerts via push'}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked: boolean) => setNotificationData({
                    ...notificationData,
                    pushNotifications: {
                      ...notificationData.pushNotifications,
                      [key]: checked
                    }
                  })}
                  disabled={!editStates.notifications}
                  className="data-[state=checked]:bg-amber-600"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationSettings
