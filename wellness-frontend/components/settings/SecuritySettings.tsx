'use client'

import React, { useState } from 'react'
import { Shield, Eye, EyeOff, Edit, Save, Loader2, AlertCircle, Monitor, Smartphone, Tablet, LogOut, Sparkles, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface Session {
  _id?: string
  user: string
  token: string
  ipAddress: string
  userAgent: string
  expiresAt: string
  isActive: boolean
  deviceInfo: {
    browser: string
    device: string
    os: string
  }
  createdAt: string
}

interface SecurityData {
  twoFactorEnabled: boolean
}

interface SecuritySettingsProps {
  editStates: { security: boolean }
  isLoading: boolean
  showPassword: boolean
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
  onEdit: (section: string) => void
  onCancel: (section: string) => void
  onSave: (section: string) => void
  sessions: Session[]
  sessionLoading: boolean
  onEndSession: (sessionId: string) => void
  onEndAllOtherSessions: () => void
  onAIPasswordChange: () => void
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  securityData: SecurityData
  setSecurityData: React.Dispatch<React.SetStateAction<SecurityData>>
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  editStates,
  isLoading,
  showPassword,
  setShowPassword,
  onEdit,
  onCancel,
  onSave,
  sessions,
  sessionLoading,
  onEndSession,
  onEndAllOtherSessions,
  onChangePassword,
  securityData,
  setSecurityData
}) => {
  // Password generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Password generation function
  const generatePassword = () => {
    setIsGenerating(true)

    // Character sets
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    // Combine alphabets
    const alphabets = lowercase + uppercase

    // Generate 12-character password with specific requirements
    let password = ''

    // Ensure at least 3 numbers
    for (let i = 0; i < 3; i++) {
      password += numbers[Math.floor(Math.random() * numbers.length)]
    }

    // Add maximum 3 symbols (random between 1-3)
    const symbolCount = Math.floor(Math.random() * 3) + 1 // 1, 2, or 3 symbols
    for (let i = 0; i < symbolCount; i++) {
      password += symbols[Math.floor(Math.random() * symbols.length)]
    }

    // Fill remaining positions with alphabets
    const remainingLength = 12 - password.length
    for (let i = 0; i < remainingLength; i++) {
      password += alphabets[Math.floor(Math.random() * alphabets.length)]
    }

    // Shuffle the password to randomize positions
    password = password.split('').sort(() => Math.random() - 0.5).join('')

    // Simulate AI generation delay
    setTimeout(() => {
      setNewPassword(password)
      setIsGenerating(false)
    }, 1000)
  }

  // Handle password change
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }

    setIsChangingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      const success = await onChangePassword(currentPassword, newPassword)
      if (success) {
        setPasswordSuccess('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordError('Failed to change password. Please check your current password.')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setPasswordError('An error occurred while changing password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Security settings</CardTitle>
            <CardDescription className="text-sm text-slate-500">Manage your account security, passwords, and active sessions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!editStates.security ? (
              <Button
                onClick={() => onEdit('security')}
                className="h-10 px-6 rounded-xl font-bold shadow-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit security
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onCancel('security')}
                  variant="outline"
                  disabled={isLoading}
                  className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSave('security')}
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
        <Alert className="bg-amber-50/50 border-amber-100 rounded-2xl p-4">
          <Shield className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 font-medium ml-2">
            Keep your account secure by regularly updating your password and enabling two-factor authentication.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Shield className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Change password</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-semibold text-slate-700 ml-1">Current password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={!editStates.security}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-semibold text-slate-700 ml-1">New password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!editStates.security}
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 ml-1">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!editStates.security}
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Password Error/Success Messages */}
            {passwordError && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            {passwordSuccess && (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={handlePasswordChange}
                disabled={!editStates.security || isChangingPassword}
                className="h-11 px-8 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update password'
                )}
              </Button>
              <Button
                onClick={generatePassword}
                disabled={!editStates.security || isGenerating}
                className="h-11 px-6 rounded-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg shadow-indigo-100 border-0"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI generate password
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Shield className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Two-factor authentication</h3>
          </div>

          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-base font-bold text-slate-900">Enable 2FA</Label>
              <p className="text-sm text-slate-500">
                Add an extra layer of security to your account with two-factor authentication
              </p>
            </div>
            <Switch
              disabled={!editStates.security}
              checked={securityData.twoFactorEnabled}
              onCheckedChange={(checked) => setSecurityData(prev => ({ ...prev, twoFactorEnabled: checked }))}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Monitor className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Login sessions</h3>
            </div>

            {sessions.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEndAllOtherSessions}
                disabled={sessionLoading}
                className="rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                End all other sessions
              </Button>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            {sessionLoading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <Loader2 className="w-4 h-4 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm font-medium text-slate-500">Loading sessions...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center p-12 space-y-3">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No active sessions found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sessions.map((session) => (
                  <div key={session._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl text-slate-500">
                        {session.deviceInfo.device.toLowerCase().includes('mobile') ? (
                          <Smartphone className="w-6 h-6" />
                        ) : session.deviceInfo.device.toLowerCase().includes('tablet') ? (
                          <Tablet className="w-6 h-6" />
                        ) : (
                          <Monitor className="w-6 h-6" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900">{session.deviceInfo.browser} on {session.deviceInfo.os}</p>
                          {session.isActive && (
                            <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-50 font-bold px-2 py-0">Current</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{session.ipAddress}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(session.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {!session.isActive && session._id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEndSession(session._id!)}
                          disabled={sessionLoading}
                          className="rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 font-bold"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SecuritySettings
