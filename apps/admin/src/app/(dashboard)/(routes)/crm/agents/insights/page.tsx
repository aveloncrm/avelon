'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Bot,
  Zap,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Target,
  
  Mail,
  MessageSquare,
  Phone,
  
} from 'lucide-react'

export default function AIInsightsPage() {
  const [timeRange, setTimeRange] = useState('30d')

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="AI Insights"
            description="Comprehensive analytics and performance metrics for all AI agents"
          />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator />

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,892</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                +12.5% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                +2.1% improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2s</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                -15% faster
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,450</div>
              <p className="text-xs text-muted-foreground">
                This period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Agent Performance Overview
            </CardTitle>
            <CardDescription>Performance metrics across all agent types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Email Agent',
                  icon: Mail,
                  requests: 18245,
                  success: 96.5,
                  avgTime: '0.8s',
                  trend: '+5.2%',
                  color: 'text-blue-600'
                },
                {
                  name: 'SMS Agent',
                  icon: MessageSquare,
                  requests: 12347,
                  success: 98.1,
                  avgTime: '0.5s',
                  trend: '+8.1%',
                  color: 'text-green-600'
                },
                {
                  name: 'Calling Agent',
                  icon: Phone,
                  requests: 8231,
                  success: 89.3,
                  avgTime: '2.4s',
                  trend: '+3.7%',
                  color: 'text-purple-600'
                },
                {
                  name: 'Custom Agents',
                  icon: Bot,
                  requests: 7069,
                  success: 92.8,
                  avgTime: '1.8s',
                  trend: '+11.4%',
                  color: 'text-orange-600'
                },
              ].map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg bg-muted ${agent.color}`}>
                      <agent.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{agent.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{agent.requests.toLocaleString()} requests</span>
                        <span>•</span>
                        <span>Success: {agent.success}%</span>
                        <span>•</span>
                        <span>Avg: {agent.avgTime}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {agent.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Performing Agents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Top Performing Agents
              </CardTitle>
              <CardDescription>Best performing agents this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Lead Nurture Email Bot', type: 'Email', score: 98.5, requests: 8420 },
                  { name: 'Customer Support SMS', type: 'SMS', score: 97.2, requests: 5230 },
                  { name: 'Appointment Reminder Bot', type: 'SMS', score: 96.8, requests: 3180 },
                  { name: 'Sales Outreach Agent', type: 'Email', score: 95.1, requests: 2890 },
                ].map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{agent.name}</h4>
                        <Badge variant="outline" className="text-xs">{agent.type}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{agent.score}%</div>
                      <div className="text-xs text-muted-foreground">{agent.requests.toLocaleString()} req</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Model Usage
              </CardTitle>
              <CardDescription>Token consumption by model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { model: 'GPT-4', tokens: 1250000, cost: 1450, percentage: 45 },
                  { model: 'GPT-3.5 Turbo', tokens: 2850000, cost: 820, percentage: 65 },
                  { model: 'Claude 3.5', tokens: 980000, cost: 180, percentage: 25 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.model}</span>
                      <div className="text-right text-xs text-muted-foreground">
                        <div>{item.tokens.toLocaleString()} tokens</div>
                        <div>${item.cost.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                          }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest AI agent activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  event: 'Email Agent completed 10K requests milestone',
                  time: '2 hours ago',
                  type: 'success'
                },
                {
                  event: 'SMS Agent performance improved by 8%',
                  time: '5 hours ago',
                  type: 'success'
                },
                {
                  event: 'New agent deployed: Lead Generation Bot',
                  time: '1 day ago',
                  type: 'info'
                },
                {
                  event: 'Calling Agent exceeded daily quota',
                  time: '2 days ago',
                  type: 'warning'
                },
                {
                  event: 'GPT-4 model updated to latest version',
                  time: '3 days ago',
                  type: 'success'
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  {activity.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : activity.type === 'warning' ? (
                    <XCircle className="h-5 w-5 text-orange-600" />
                  ) : (
                    <Activity className="h-5 w-5 text-blue-600" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
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
