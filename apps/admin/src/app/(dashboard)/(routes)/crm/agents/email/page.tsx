'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Settings, Save, Zap, MessageSquare, Eye, Edit3, Bot, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function EmailAgentPage() {
  const [agentEnabled, setAgentEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Email Agent configuration saved successfully')
    } catch {
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Email Agent"
            description="Configure AI-powered email agent for automated outreach and campaigns"
          />
          <Button onClick={handleSave} disabled={loading} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
        <Separator />

        <Card className={`border-2 ${agentEnabled ? 'border-green-500' : 'border-gray-200'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${agentEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Mail className={`h-6 w-6 ${agentEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <CardTitle>Agent Status</CardTitle>
                  <CardDescription>
                    {agentEnabled ? 'Active and ready to send emails' : 'Currently disabled'}
                  </CardDescription>
                </div>
              </div>
              <Switch checked={agentEnabled} onCheckedChange={setAgentEnabled} />
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Basic Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agentName">Agent Name</Label>
                <Input id="agentName" defaultValue="AI Email Agent" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input id="senderName" defaultValue="Your Company" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderEmail">Sender Email</Label>
                <Input id="senderEmail" type="email" defaultValue="ai-agent@yourcompany.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyEmail">Reply-To Email</Label>
                <Input id="replyEmail" type="email" defaultValue="noreply@yourcompany.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Email Tone</Label>
                <Select defaultValue="professional">
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectPrefix">Subject Line Prefix</Label>
                <Input id="subjectPrefix" defaultValue="[Company] " placeholder="e.g., [Company] " />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="aiWriting" className="font-medium">AI Content Writing</Label>
                    <p className="text-xs text-muted-foreground">Generate engaging email content automatically</p>
                  </div>
                </div>
                <Switch id="aiWriting" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Edit3 className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="personalization" className="font-medium">Personalization</Label>
                    <p className="text-xs text-muted-foreground">Automatically personalize each email</p>
                  </div>
                </div>
                <Switch id="personalization" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="subjectLine" className="font-medium">Subject Line Optimization</Label>
                    <p className="text-xs text-muted-foreground">AI-optimized subject lines for better open rates</p>
                  </div>
                </div>
                <Switch id="subjectLine" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="tracking" className="font-medium">Email Tracking</Label>
                    <p className="text-xs text-muted-foreground">Track opens, clicks, and engagement</p>
                  </div>
                </div>
                <Switch id="tracking" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agent Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">Cold Emails</h4>
                  <p className="text-sm text-muted-foreground">Send initial outreach to new leads</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">Follow-up Emails</h4>
                  <p className="text-sm text-muted-foreground">Automatically send follow-up sequences</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">Newsletter Campaigns</h4>
                  <p className="text-sm text-muted-foreground">Send automated newsletter campaigns</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">Event Invitations</h4>
                  <p className="text-sm text-muted-foreground">Automated event invitations and reminders</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-primary">8,421</div>
                <div className="text-sm text-muted-foreground">Emails Sent</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">64%</div>
                <div className="text-sm text-muted-foreground">Open Rate</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">12%</div>
                <div className="text-sm text-muted-foreground">Click Rate</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">18%</div>
                <div className="text-sm text-muted-foreground">Reply Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

