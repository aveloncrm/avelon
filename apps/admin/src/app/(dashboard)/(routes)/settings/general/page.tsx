'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Save } from 'lucide-react'

export default function GeneralSettingsPage() {
    const [formData, setFormData] = useState({
        companyName: 'Galamine AI',
        companyEmail: 'contact@galamine.ai',
        companyPhone: '+1 (555) 123-4567',
        companyWebsite: 'https://www.galamine.ai',
        timezone: 'America/New_York',
        language: 'en',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        description: 'Enterprise CRM and marketing automation platform',
        allowRegistrations: true,
        requireEmailVerification: true,
        maintenanceMode: false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Saving general settings:', formData)
        // Implement save functionality
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="General Settings"
                        description="Manage your organization's general settings"
                    />
                    <Button onClick={handleSubmit}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
                <Separator />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>
                                Basic information about your organization
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Company Name</Label>
                                    <Input
                                        id="companyName"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companyEmail">Company Email</Label>
                                    <Input
                                        id="companyEmail"
                                        type="email"
                                        value={formData.companyEmail}
                                        onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="companyPhone">Company Phone</Label>
                                    <Input
                                        id="companyPhone"
                                        value={formData.companyPhone}
                                        onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companyWebsite">Company Website</Label>
                                    <Input
                                        id="companyWebsite"
                                        value={formData.companyWebsite}
                                        onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Company Description</Label>
                                <Textarea
                                    id="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Regional Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Regional Settings</CardTitle>
                            <CardDescription>
                                Configure timezone, language, and currency preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                                        <SelectTrigger id="timezone">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                            <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                                            <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                                            <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                                        <SelectTrigger id="language">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="de">German</SelectItem>
                                            <SelectItem value="it">Italian</SelectItem>
                                            <SelectItem value="pt">Portuguese</SelectItem>
                                            <SelectItem value="zh">Chinese</SelectItem>
                                            <SelectItem value="ja">Japanese</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                                        <SelectTrigger id="currency">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                                            <SelectItem value="CNY">CNY (¥)</SelectItem>
                                            <SelectItem value="AED">AED (د.إ)</SelectItem>
                                            <SelectItem value="INR">INR (₹)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateFormat">Date Format</Label>
                                    <Select value={formData.dateFormat} onValueChange={(value) => setFormData({ ...formData, dateFormat: value })}>
                                        <SelectTrigger id="dateFormat">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                            <SelectItem value="DD-MMM-YYYY">DD-MMM-YYYY</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Configure user registration and verification settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="allowRegistrations">Allow User Registrations</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow new users to create accounts
                                    </p>
                                </div>
                                <Switch
                                    id="allowRegistrations"
                                    checked={formData.allowRegistrations}
                                    onCheckedChange={(checked) => setFormData({ ...formData, allowRegistrations: checked })}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Users must verify their email before accessing the platform
                                    </p>
                                </div>
                                <Switch
                                    id="requireEmailVerification"
                                    checked={formData.requireEmailVerification}
                                    onCheckedChange={(checked) => setFormData({ ...formData, requireEmailVerification: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>System Settings</CardTitle>
                            <CardDescription>
                                Configure system-wide settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable to restrict access to administrators only
                                    </p>
                                </div>
                                <Switch
                                    id="maintenanceMode"
                                    checked={formData.maintenanceMode}
                                    onCheckedChange={(checked) => setFormData({ ...formData, maintenanceMode: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}
