'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Bell, Mail, MessageSquare, TrendingUp } from 'lucide-react'

interface NotificationSettings {
  email: {
    newOrders: boolean
    payments: boolean
    teamUpdates: boolean
    security: boolean
  }
  push: {
    newOrders: boolean
    payments: boolean
    teamUpdates: boolean
    marketing: boolean
  }
  sms: {
    newOrders: boolean
    payments: boolean
    critical: boolean
  }
  digest: {
    daily: boolean
    weekly: boolean
    frequency: 'never' | 'daily' | 'weekly'
  }
}

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      newOrders: true,
      payments: true,
      teamUpdates: true,
      security: true,
    },
    push: {
      newOrders: true,
      payments: false,
      teamUpdates: true,
      marketing: false,
    },
    sms: {
      newOrders: false,
      payments: false,
      critical: true,
    },
    digest: {
      daily: true,
      weekly: true,
      frequency: 'daily',
    },
  })

  const handleSave = () => {
    console.log('Saving notification settings:', settings)
  }

  const updateEmailSetting = (key: keyof NotificationSettings['email'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      email: { ...prev.email, [key]: value },
    }))
  }

  const updatePushSetting = (key: keyof NotificationSettings['push'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      push: { ...prev.push, [key]: value },
    }))
  }

  const updateSmsSetting = (key: keyof NotificationSettings['sms'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      sms: { ...prev.sms, [key]: value },
    }))
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Notification Settings"
            description="Manage how and when you receive notifications"
          />
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
        <Separator />

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure email notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-orders">New Orders</Label>
                <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
              </div>
              <Switch
                id="email-orders"
                checked={settings.email.newOrders}
                onCheckedChange={(checked) => updateEmailSetting('newOrders', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-payments">Payment Updates</Label>
                <p className="text-sm text-muted-foreground">Notifications about payments and transactions</p>
              </div>
              <Switch
                id="email-payments"
                checked={settings.email.payments}
                onCheckedChange={(checked) => updateEmailSetting('payments', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-team">Team Updates</Label>
                <p className="text-sm text-muted-foreground">When team members join, leave, or change roles</p>
              </div>
              <Switch
                id="email-team"
                checked={settings.email.teamUpdates}
                onCheckedChange={(checked) => updateEmailSetting('teamUpdates', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-security">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Important security and account changes</p>
              </div>
              <Switch
                id="email-security"
                checked={settings.email.security}
                onCheckedChange={(checked) => updateEmailSetting('security', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Browser and mobile push notifications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-orders">New Orders</Label>
                <p className="text-sm text-muted-foreground">Real-time order notifications</p>
              </div>
              <Switch
                id="push-orders"
                checked={settings.push.newOrders}
                onCheckedChange={(checked) => updatePushSetting('newOrders', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-payments">Payment Updates</Label>
                <p className="text-sm text-muted-foreground">Payment and transaction alerts</p>
              </div>
              <Switch
                id="push-payments"
                checked={settings.push.payments}
                onCheckedChange={(checked) => updatePushSetting('payments', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-team">Team Updates</Label>
                <p className="text-sm text-muted-foreground">Team activity and changes</p>
              </div>
              <Switch
                id="push-team"
                checked={settings.push.teamUpdates}
                onCheckedChange={(checked) => updatePushSetting('teamUpdates', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-marketing">Marketing Updates</Label>
                <p className="text-sm text-muted-foreground">Campaign and marketing notifications</p>
              </div>
              <Switch
                id="push-marketing"
                checked={settings.push.marketing}
                onCheckedChange={(checked) => updatePushSetting('marketing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>SMS Notifications</CardTitle>
                <CardDescription>Text message alerts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input id="phone-number" type="tel" placeholder="+1 (555) 123-4567" />
              <p className="text-xs text-muted-foreground">
                Enter your phone number to receive SMS notifications
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-orders">New Orders</Label>
                <p className="text-sm text-muted-foreground">Order notifications via SMS</p>
              </div>
              <Switch
                id="sms-orders"
                checked={settings.sms.newOrders}
                onCheckedChange={(checked) => updateSmsSetting('newOrders', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-payments">Payment Updates</Label>
                <p className="text-sm text-muted-foreground">Important payment notifications</p>
              </div>
              <Switch
                id="sms-payments"
                checked={settings.sms.payments}
                onCheckedChange={(checked) => updateSmsSetting('payments', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-critical">Critical Alerts</Label>
                <p className="text-sm text-muted-foreground">Urgent security and system alerts</p>
              </div>
              <Switch
                id="sms-critical"
                checked={settings.sms.critical}
                onCheckedChange={(checked) => updateSmsSetting('critical', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Digest Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Email Digest</CardTitle>
                <CardDescription>Summary of important updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="digest-frequency">Digest Frequency</Label>
              <Select
                value={settings.digest.frequency}
                onValueChange={(value: 'never' | 'daily' | 'weekly') =>
                  setSettings((prev) => ({
                    ...prev,
                    digest: { ...prev.digest, frequency: value },
                  }))
                }
              >
                <SelectTrigger id="digest-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Receive a summary email with recent activity
              </p>
            </div>
            {settings.digest.frequency !== 'never' && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="digest-daily">Daily Summary</Label>
                    <p className="text-sm text-muted-foreground">Include in daily digest</p>
                  </div>
                  <Switch
                    id="digest-daily"
                    checked={settings.digest.daily}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        digest: { ...prev.digest, daily: checked },
                      }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="digest-weekly">Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">Include in weekly digest</p>
                  </div>
                  <Switch
                    id="digest-weekly"
                    checked={settings.digest.weekly}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        digest: { ...prev.digest, weekly: checked },
                      }))
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
