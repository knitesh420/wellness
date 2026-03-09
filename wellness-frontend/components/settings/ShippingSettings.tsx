'use client'

import React from 'react'
import { Edit, Save, Loader2, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface ShippingZone {
  id: number
  name: string
  rate: number
  freeShipping: number
}

interface ShippingData {
  defaultShippingRate: number
  freeShippingThreshold: number
  shippingZones: ShippingZone[]
  deliveryTime: {
    standard: string
    express: string
    overnight: string
  }
}

interface ShippingSettingsProps {
  shippingData: ShippingData
  setShippingData: React.Dispatch<React.SetStateAction<ShippingData>>
  editStates: { shipping: boolean }
  isLoading: boolean
  onEdit: (section: string) => void
  onCancel: (section: string) => void
  onSave: (section: string) => void
}

const ShippingSettings: React.FC<ShippingSettingsProps> = ({
  shippingData,
  setShippingData,
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
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Shipping settings</CardTitle>
            <CardDescription className="text-sm text-slate-500">Configure shipping rates, free shipping thresholds, and delivery timeframes</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!editStates.shipping ? (
              <Button
                onClick={() => onEdit('shipping')}
                className="h-10 px-6 rounded-xl font-bold shadow-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit shipping
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onCancel('shipping')}
                  variant="outline"
                  disabled={isLoading}
                  className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSave('shipping')}
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
            <Label htmlFor="defaultShippingRate" className="text-sm font-semibold text-slate-700 ml-1">Default shipping rate (₹)</Label>
            <Input
              id="defaultShippingRate"
              type="number"
              value={shippingData.defaultShippingRate}
              onChange={(e) => setShippingData({ ...shippingData, defaultShippingRate: Number(e.target.value) })}
              disabled={!editStates.shipping}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="freeShippingThreshold" className="text-sm font-semibold text-slate-700 ml-1">Free shipping threshold (₹)</Label>
            <Input
              id="freeShippingThreshold"
              type="number"
              value={shippingData.freeShippingThreshold}
              onChange={(e) => setShippingData({ ...shippingData, freeShippingThreshold: Number(e.target.value) })}
              disabled={!editStates.shipping}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
            />
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Truck className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Shipping zones</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {shippingData.shippingZones.map((zone) => (
              <div key={zone.id} className="border border-slate-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Zone name</Label>
                    <Input
                      value={zone.name}
                      readOnly
                      className="h-11 rounded-xl border-slate-100 bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Shipping rate (₹)</Label>
                    <Input
                      type="number"
                      value={zone.rate}
                      onChange={(e) => {
                        const updatedZones = shippingData.shippingZones.map(z =>
                          z.id === zone.id ? { ...z, rate: Number(e.target.value) } : z
                        )
                        setShippingData({ ...shippingData, shippingZones: updatedZones })
                      }}
                      disabled={!editStates.shipping}
                      className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">Free shipping threshold (₹)</Label>
                    <Input
                      type="number"
                      value={zone.freeShipping}
                      onChange={(e) => {
                        const updatedZones = shippingData.shippingZones.map(z =>
                          z.id === zone.id ? { ...z, freeShipping: Number(e.target.value) } : z
                        )
                        setShippingData({ ...shippingData, shippingZones: updatedZones })
                      }}
                      disabled={!editStates.shipping}
                      className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <span className="text-amber-600 font-bold text-xs">TIMER</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Delivery timeframes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="standardDelivery" className="text-sm font-semibold text-slate-700 ml-1">Standard delivery</Label>
              <Input
                id="standardDelivery"
                value={shippingData.deliveryTime.standard}
                onChange={(e) => setShippingData({
                  ...shippingData,
                  deliveryTime: {
                    ...shippingData.deliveryTime,
                    standard: e.target.value
                  }
                })}
                disabled={!editStates.shipping}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
                placeholder="3-5 business days"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expressDelivery" className="text-sm font-semibold text-slate-700 ml-1">Express delivery</Label>
              <Input
                id="expressDelivery"
                value={shippingData.deliveryTime.express}
                onChange={(e) => setShippingData({
                  ...shippingData,
                  deliveryTime: {
                    ...shippingData.deliveryTime,
                    express: e.target.value
                  }
                })}
                disabled={!editStates.shipping}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
                placeholder="1-2 business days"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overnightDelivery" className="text-sm font-semibold text-slate-700 ml-1">Overnight delivery</Label>
              <Input
                id="overnightDelivery"
                value={shippingData.deliveryTime.overnight}
                onChange={(e) => setShippingData({
                  ...shippingData,
                  deliveryTime: {
                    ...shippingData.deliveryTime,
                    overnight: e.target.value
                  }
                })}
                disabled={!editStates.shipping}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
                placeholder="Next business day"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ShippingSettings
