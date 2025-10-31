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
import { Phone, Settings, Save, Zap, Clock, MessageSquare, Mic, Volume2, Bot } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CallingAgentPage() {
    const [agentEnabled, setAgentEnabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Calling Agent configuration saved successfully')
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
                        title="Calling Agent"
                        description="Configure AI-powered calling agent for automated outreach"
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
                                    <Phone className={`h-6 w-6 ${agentEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                                </div>
                                <div>
                                    <CardTitle>Agent Status</CardTitle>
                                    <CardDescription>
                                        {agentEnabled ? 'Active and ready to make calls' : 'Currently disabled'}
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
                                <Input id="agentName" defaultValue="AI Calling Agent" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="voice">Voice Style</Label>
                                <Select defaultValue="professional">
                                    <SelectTrigger id="voice">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="friendly">Friendly</SelectItem>
                                        <SelectItem value="formal">Formal</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
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
                                <Label htmlFor="greeting">Opening Greeting</Label>
                                <Textarea
                                    id="greeting"
                                    defaultValue="Hello, I'm calling from [Company]. How are you today?"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Max Call Duration (minutes)</Label>
                                <Input id="duration" type="number" min="1" max="30" defaultValue="5" />
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
                                    <Mic className="h-5 w-5 text-primary" />
                                    <div>
                                        <Label htmlFor="voicemail" className="font-medium">Voicemail Detection</Label>
                                        <p className="text-xs text-muted-foreground">Automatically detect and handle voicemails</p>
                                    </div>
                                </div>
                                <Switch id="voicemail" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    <div>
                                        <Label htmlFor="sentiment" className="font-medium">Sentiment Analysis</Label>
                                        <p className="text-xs text-muted-foreground">Analyze caller sentiment in real-time</p>
                                    </div>
                                </div>
                                <Switch id="sentiment" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Volume2 className="h-5 w-5 text-primary" />
                                    <div>
                                        <Label htmlFor="recording" className="font-medium">Call Recording</Label>
                                        <p className="text-xs text-muted-foreground">Record and transcribe all calls</p>
                                    </div>
                                </div>
                                <Switch id="recording" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <div>
                                        <Label htmlFor="scheduling" className="font-medium">Smart Scheduling</Label>
                                        <p className="text-xs text-muted-foreground">Automatically schedule follow-ups</p>
                                    </div>
                                </div>
                                <Switch id="scheduling" defaultChecked />
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
                                    <h4 className="font-medium">Cold Calls</h4>
                                    <p className="text-sm text-muted-foreground">Make outbound calls to new leads</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <h4 className="font-medium">Follow-up Calls</h4>
                                    <p className="text-sm text-muted-foreground">Automatically follow up on previous conversations</p>
                                </div>
                                <Switch defaultChecked />
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
                                <div className="text-2xl font-bold text-primary">1,245</div>
                                <div className="text-sm text-muted-foreground">Total Calls</div>
                            </div>
                            <div className="text-center p-4 rounded-lg border">
                                <div className="text-2xl font-bold text-green-600">68%</div>
                                <div className="text-sm text-muted-foreground">Connect Rate</div>
                            </div>
                            <div className="text-center p-4 rounded-lg border">
                                <div className="text-2xl font-bold text-blue-600">42%</div>
                                <div className="text-sm text-muted-foreground">Engagement</div>
                            </div>
                            <div className="text-center p-4 rounded-lg border">
                                <div className="text-2xl font-bold text-orange-600">23%</div>
                                <div className="text-sm text-muted-foreground">Meetings Booked</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

