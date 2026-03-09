'use client'

import React from 'react'
import { CreditCard, Truck, Eye, EyeOff, Edit, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

interface PaymentData {
  currency: string
  paymentMethods: {
    razorpay: {
      enabled: boolean
      keyId: string
      keySecret: string
    }
    paypal: {
      enabled: boolean
      clientId: string
      clientSecret: string
    }
    stripe: {
      enabled: boolean
      publishableKey: string
      secretKey: string
    }
    cod: {
      enabled: boolean
      minAmount: number
      maxAmount: number
    }
  }
  taxSettings: {
    gstRate: number
    cgstRate: number
    sgstRate: number
    igstRate: number
  }
}

interface PaymentSettingsProps {
  paymentData: PaymentData
  setPaymentData: React.Dispatch<React.SetStateAction<PaymentData>>
  editStates: { payments: boolean }
  isLoading: boolean
  showPassword: boolean
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
  onEdit: (section: string) => void
  onCancel: (section: string) => void
  onSave: (section: string) => void
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({
  paymentData,
  setPaymentData,
  editStates,
  isLoading,
  showPassword,
  setShowPassword,
  onEdit,
  onCancel,
  onSave
}) => {
  return (
    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Payment settings</CardTitle>
            <CardDescription className="text-sm text-slate-500">Configure payment gateways, default currency, and tax rates</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!editStates.payments ? (
              <Button
                onClick={() => onEdit('payments')}
                className="h-10 px-6 rounded-xl font-bold shadow-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit payments
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onCancel('payments')}
                  variant="outline"
                  disabled={isLoading}
                  className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSave('payments')}
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
        <div className="max-w-md space-y-2">
          <Label htmlFor="currency" className="text-sm font-semibold text-slate-700 ml-1">Default currency</Label>
          <Select
            value={paymentData.currency}
            onValueChange={(value) => setPaymentData({ ...paymentData, currency: value })}
            disabled={!editStates.payments}
          >
            <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
              <SelectItem value="USD">US Dollar ($)</SelectItem>
              <SelectItem value="EUR">Euro (€)</SelectItem>
              <SelectItem value="GBP">British Pound (£)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 ml-1">This currency will be used for all transactions and reporting</p>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <CreditCard className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Payment gateways</h3>
          </div>

          <div className="space-y-4">
            {/* Razorpay */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Razorpay</h4>
                      <p className="text-sm text-slate-500">Accept UPI, cards, and netbanking</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentData.paymentMethods.razorpay.enabled}
                    onCheckedChange={(checked: boolean) => setPaymentData({
                      ...paymentData,
                      paymentMethods: {
                        ...paymentData.paymentMethods,
                        razorpay: {
                          ...paymentData.paymentMethods.razorpay,
                          enabled: checked
                        }
                      }
                    })}
                    disabled={!editStates.payments}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>

                {paymentData.paymentMethods.razorpay.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="razorpayKeyId" className="text-sm font-semibold text-slate-700 ml-1">Key ID</Label>
                      <Input
                        id="razorpayKeyId"
                        value={paymentData.paymentMethods.razorpay.keyId}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          paymentMethods: {
                            ...paymentData.paymentMethods,
                            razorpay: {
                              ...paymentData.paymentMethods.razorpay,
                              keyId: e.target.value
                            }
                          }
                        })}
                        disabled={!editStates.payments}
                        className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="razorpayKeySecret" className="text-sm font-semibold text-slate-700 ml-1">Key secret</Label>
                      <div className="relative">
                        <Input
                          id="razorpayKeySecret"
                          type={showPassword ? "text" : "password"}
                          value={paymentData.paymentMethods.razorpay.keySecret}
                          onChange={(e) => setPaymentData({
                            ...paymentData,
                            paymentMethods: {
                              ...paymentData.paymentMethods,
                              razorpay: {
                                ...paymentData.paymentMethods.razorpay,
                                keySecret: e.target.value
                              }
                            }
                          })}
                          disabled={!editStates.payments}
                          className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cash on Delivery */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Cash on delivery</h4>
                      <p className="text-sm text-slate-500">Collect payment at the time of delivery</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentData.paymentMethods.cod.enabled}
                    onCheckedChange={(checked: boolean) => setPaymentData({
                      ...paymentData,
                      paymentMethods: {
                        ...paymentData.paymentMethods,
                        cod: {
                          ...paymentData.paymentMethods.cod,
                          enabled: checked
                        }
                      }
                    })}
                    disabled={!editStates.payments}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                {paymentData.paymentMethods.cod.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="codMinAmount" className="text-sm font-semibold text-slate-700 ml-1">Minimum amount</Label>
                      <Input
                        id="codMinAmount"
                        type="number"
                        value={paymentData.paymentMethods.cod.minAmount}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          paymentMethods: {
                            ...paymentData.paymentMethods,
                            cod: {
                              ...paymentData.paymentMethods.cod,
                              minAmount: Number(e.target.value)
                            }
                          }
                        })}
                        disabled={!editStates.payments}
                        className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codMaxAmount" className="text-sm font-semibold text-slate-700 ml-1">Maximum amount</Label>
                      <Input
                        id="codMaxAmount"
                        type="number"
                        value={paymentData.paymentMethods.cod.maxAmount}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          paymentMethods: {
                            ...paymentData.paymentMethods,
                            cod: {
                              ...paymentData.paymentMethods.cod,
                              maxAmount: Number(e.target.value)
                            }
                          }
                        })}
                        disabled={!editStates.payments}
                        className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <span className="text-amber-600 font-bold text-xs uppercase">Tax</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Tax settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gstRate" className="text-sm font-semibold text-slate-700 ml-1">Gst rate (%)</Label>
              <Input
                id="gstRate"
                type="number"
                value={paymentData.taxSettings.gstRate}
                onChange={(e) => setPaymentData({
                  ...paymentData,
                  taxSettings: {
                    ...paymentData.taxSettings,
                    gstRate: Number(e.target.value)
                  }
                })}
                disabled={!editStates.payments}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cgstRate" className="text-sm font-semibold text-slate-700 ml-1">Cgst rate (%)</Label>
              <Input
                id="cgstRate"
                type="number"
                value={paymentData.taxSettings.cgstRate}
                onChange={(e) => setPaymentData({
                  ...paymentData,
                  taxSettings: {
                    ...paymentData.taxSettings,
                    cgstRate: Number(e.target.value)
                  }
                })}
                disabled={!editStates.payments}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sgstRate" className="text-sm font-semibold text-slate-700 ml-1">Sgst rate (%)</Label>
              <Input
                id="sgstRate"
                type="number"
                value={paymentData.taxSettings.sgstRate}
                onChange={(e) => setPaymentData({
                  ...paymentData,
                  taxSettings: {
                    ...paymentData.taxSettings,
                    sgstRate: Number(e.target.value)
                  }
                })}
                disabled={!editStates.payments}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="igstRate" className="text-sm font-semibold text-slate-700 ml-1">Igst rate (%)</Label>
              <Input
                id="igstRate"
                type="number"
                value={paymentData.taxSettings.igstRate}
                onChange={(e) => setPaymentData({
                  ...paymentData,
                  taxSettings: {
                    ...paymentData.taxSettings,
                    igstRate: Number(e.target.value)
                  }
                })}
                disabled={!editStates.payments}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentSettings
