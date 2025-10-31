'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, CheckCircle2, MoreVertical, Settings, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Integration {
  id: string
  name: string
  description: string
  category: 'email' | 'payment' | 'storage' | 'analytics' | 'communication'
  status: 'connected' | 'disconnected'
  icon: string
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Mailchimp',
    description: 'Email marketing automation',
    category: 'email',
    status: 'connected',
    icon: '📧',
  },
  {
    id: '2',
    name: 'Stripe',
    description: 'Payment processing',
    category: 'payment',
    status: 'connected',
    icon: '💳',
  },
  {
    id: '3',
    name: 'Google Analytics',
    description: 'Website analytics and tracking',
    category: 'analytics',
    status: 'disconnected',
    icon: '📊',
  },
  {
    id: '4',
    name: 'Slack',
    description: 'Team communication',
    category: 'communication',
    status: 'disconnected',
    icon: '💬',
  },
  {
    id: '5',
    name: 'AWS S3',
    description: 'Cloud storage',
    category: 'storage',
    status: 'disconnected',
    icon: '☁️',
  },
  {
    id: '6',
    name: 'Zapier',
    description: 'Automation and workflows',
    category: 'email',
    status: 'disconnected',
    icon: '⚡',
  },
  {
    id: '7',
    name: 'PayPal',
    description: 'Payment gateway',
    category: 'payment',
    status: 'disconnected',
    icon: '💰',
  },
  {
    id: '8',
    name: 'SendGrid',
    description: 'Transactional email service',
    category: 'email',
    status: 'disconnected',
    icon: '✉️',
  },
]

export default function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIntegrations = integrations.filter(
    (integration) =>
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const connectedIntegrations = integrations.filter((i) => i.status === 'connected')
  const disconnectedIntegrations = integrations.filter((i) => i.status === 'disconnected')

  const handleToggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status: integration.status === 'connected' ? 'disconnected' : 'connected',
            }
          : integration
      )
    )
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Integrations"
          description="Connect and manage your third-party integrations"
        />
        <Separator />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{integrations.length}</div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{connectedIntegrations.length}</div>
              <p className="text-xs text-muted-foreground">Active connections</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{disconnectedIntegrations.length}</div>
              <p className="text-xs text-muted-foreground">Ready to connect</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Integration types</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Connected Integrations */}
        {connectedIntegrations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Connected Integrations</CardTitle>
              <CardDescription>Manage your active integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {integrations
                  .filter((i) => i.status === 'connected')
                  .map((integration) => (
                    <div
                      key={integration.id}
                      className="relative rounded-lg border p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
                            {integration.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleToggleConnection(integration.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Badge className="mt-3 bg-green-100 text-green-800">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Available Integrations</CardTitle>
            <CardDescription>Connect new services to extend functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIntegrations
                .filter((i) => i.status === 'disconnected')
                .map((integration) => (
                  <div
                    key={integration.id}
                    className="relative rounded-lg border p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
                          {integration.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="mt-3 w-full"
                      onClick={() => handleToggleConnection(integration.id)}
                    >
                      Connect
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
