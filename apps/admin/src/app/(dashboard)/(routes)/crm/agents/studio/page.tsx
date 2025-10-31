'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
    Bot,
    Settings,
    Save,
    Zap,
    Play,
    Copy,
    FileText,
    Layers,
    Plus,
    Mail,
    MessageSquare,
    Phone,
    Eye,
    Rocket
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AgentStudioPage() {
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Agent configuration saved successfully')
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
                        title="Agent Studio"
                        description="Build, customize, and deploy AI agents with a visual interface"
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" size="lg">
                            <Play className="mr-2 h-4 w-4" />
                            Test Agent
                        </Button>
                        <Button onClick={handleSave} disabled={loading} size="lg">
                            <Save className="mr-2 h-4 w-4" />
                            {loading ? 'Saving...' : 'Save Agent'}
                        </Button>
                    </div>
                </div>
                <Separator />

                {/* Workflow Builder */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Workflow Builder
                        </CardTitle>
                        <CardDescription>Drag and drop to build your agent's workflow</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="font-semibold mb-2">Visual Workflow Builder</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Drag components from the sidebar to build your agent workflow
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button variant="outline" size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Step
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Agent Templates */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Layers className="h-5 w-5" />
                                    Start from Template
                                </CardTitle>
                                <CardDescription>Choose a pre-built agent template to get started</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <Mail className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <h4 className="font-semibold">Email Outreach Agent</h4>
                                        <p className="text-xs text-muted-foreground">Email automation</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="mb-3">Popular</Badge>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Automate email campaigns with personalization and follow-ups
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Copy className="mr-2 h-4 w-4" />
                                    Use Template
                                </Button>
                            </div>

                            <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <MessageSquare className="h-8 w-8 text-green-600" />
                                    <div>
                                        <h4 className="font-semibold">SMS Campaign Agent</h4>
                                        <p className="text-xs text-muted-foreground">Text messaging</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Send automated SMS campaigns with two-way messaging
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Copy className="mr-2 h-4 w-4" />
                                    Use Template
                                </Button>
                            </div>

                            <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <Phone className="h-8 w-8 text-purple-600" />
                                    <div>
                                        <h4 className="font-semibold">Call Center Agent</h4>
                                        <p className="text-xs text-muted-foreground">Voice assistant</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="mb-3">Advanced</Badge>
                                <p className="text-sm text-muted-foreground mb-4">
                                    AI-powered calling agent with sentiment analysis
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Copy className="mr-2 h-4 w-4" />
                                    Use Template
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Custom Agent Configuration */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="h-5 w-5" />
                                Agent Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="agentName">Agent Name</Label>
                                <Input id="agentName" placeholder="My Custom Agent" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="agentType">Agent Type</Label>
                                <Select defaultValue="custom">
                                    <SelectTrigger id="agentType">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="email">Email Agent</SelectItem>
                                        <SelectItem value="sms">SMS Agent</SelectItem>
                                        <SelectItem value="calling">Calling Agent</SelectItem>
                                        <SelectItem value="custom">Custom Agent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Describe what this agent does..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                AI Capabilities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="model">AI Model</Label>
                                <Select defaultValue="gpt-4">
                                    <SelectTrigger id="model">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                                        <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                                        <SelectItem value="claude">Claude 3.5</SelectItem>
                                        <SelectItem value="custom">Custom Model</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="temperature">Response Temperature</Label>
                                <div className="flex items-center gap-2">
                                    <input type="range" min="0" max="2" step="0.1" defaultValue="0.7" className="flex-1" />
                                    <span className="text-sm text-muted-foreground w-12">0.7</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Lower = more focused, Higher = more creative</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tokens">Max Tokens</Label>
                                <Input id="tokens" type="number" defaultValue="1000" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* My Agents */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    My Agents
                                </CardTitle>
                                <CardDescription>Manage your deployed agents</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                New Agent
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { name: 'Lead Nurture Agent', type: 'Email', status: 'Active', usage: '2.4K requests' },
                                { name: 'Customer Support Bot', type: 'Custom', status: 'Active', usage: '5.8K requests' },
                                { name: 'Sales Outreach SMS', type: 'SMS', status: 'Paused', usage: '1.2K requests' },
                            ].map((agent, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Bot className="h-8 w-8 text-primary" />
                                        <div>
                                            <h4 className="font-medium">{agent.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Badge variant="outline">{agent.type}</Badge>
                                                <span>•</span>
                                                <span>{agent.usage}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={agent.status === 'Active' ? 'default' : 'secondary'}>
                                            {agent.status}
                                        </Badge>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Rocket className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

