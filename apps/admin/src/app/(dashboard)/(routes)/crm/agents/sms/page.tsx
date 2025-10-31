'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, Save, Zap, Clock, MessageSquare, Bot, Phone, Shield, Bell } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SMSAgentPage() {
  const [agentEnabled, setAgentEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('SMS Agent configuration saved successfully')
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
            title="SMS Agent"
            description="Configure AI-powered SMS agent for automated text messaging"
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
                  <MessageSquare className={`h-6 w-6 ${agentEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <CardTitle>Agent Status</CardTitle>
                  <CardDescription>
                    {agentEnabled ? 'Active and ready to send SMS' : 'Currently disabled'}
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
                <Input id="agentName" defaultValue="AI SMS Agent" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderId">Sender ID / Phone Number</Label>
                <Input id="senderId" placeholder="+1234567890" defaultValue="+1234567890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Message Tone</Label>
                <Select defaultValue="professional">
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
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
                <Label htmlFor="messageTemplate">Default Message Template</Label>
                <Textarea
                  id="messageTemplate"
                  defaultValue="Hi [Name], [Your message here]"
                  rows={3}
                  placeholder="Hi [Name], [Your message here]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="characterLimit">Character Limit Alert</Label>
                <Input id="characterLimit" type="number" min="100" max="2000" defaultValue="160" />
                <p className="text-xs text-muted-foreground">Alert when approaching SMS character limit</p>
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
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="twoWay" className="font-medium">Two-way Messaging</Label>
                    <p className="text-xs text-muted-foreground">Enable conversational SMS interactions</p>
                  </div>
                </div>
                <Switch id="twoWay" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="autoReply" className="font-medium">Auto-Reply</Label>
                    <p className="text-xs text-muted-foreground">Automatically respond to incoming messages</p>
                  </div>
                </div>
                <Switch id="autoReply" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="reminders" className="font-medium">Smart Reminders</Label>
                    <p className="text-xs text-muted-foreground">Send automated appointment reminders</p>
                  </div>
                </div>
                <Switch id="reminders" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="scheduling" className="font-medium">Smart Scheduling</Label>
                    <p className="text-xs text-muted-foreground">Send messages at optimal times</p>
                  </div>
                </div>
                <Switch id="scheduling" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="optOut" className="font-medium">Opt-out Handling</Label>
                    <p className="text-xs text-muted-foreground">Automatically handle STOP requests</p>
                  </div>
                </div>
                <Switch id="optOut" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="notifications" className="font-medium">Delivery Notifications</Label>
                    <p className="text-xs text-muted-foreground">Track SMS delivery status</p>
                  </div>
                </div>
                <Switch id="notifications" defaultChecked />
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
                  <h4 className="font-medium">Promotional SMS</h4>
                  <p className="text-sm text-muted-foreground">Send promotional messages and offers</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">Transaction Alerts</h4>
                  <p className="text-sm text-muted-foreground">Send order confirmations and updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">Appointment Reminders</h4>
                  <p className="text-sm text-muted-foreground">Automated appointment and meeting reminders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">Authentication Codes</h4>
                  <p className="text-sm text-muted-foreground">Send OTP and verification codes</p>
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
                <div className="text-2xl font-bold text-primary">3,872</div>
                <div className="text-sm text-muted-foreground">Messages Sent</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-muted-foreground">Delivery Rate</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">24%</div>
                <div className="text-sm text-muted-foreground">Reply Rate</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">12%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

