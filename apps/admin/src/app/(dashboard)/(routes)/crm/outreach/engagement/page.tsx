'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Phone, Calendar, MessageSquare, MousePointer, Eye } from 'lucide-react'
import { mockEngagementActivities, getEngagementStats } from '@/lib/mock-data/crm-sequences'
import { MetricCard } from '@/components/crm/metric-card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default function EngagementPage() {
  const stats = getEngagementStats()
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('all')

  const activityIcons = {
    email_sent: Mail,
    email_opened: Eye,
    email_clicked: MousePointer,
    email_replied: MessageSquare,
    call_made: Phone,
    call_answered: Phone,
    meeting_booked: Calendar,
    sms_sent: MessageSquare,
    sms_replied: MessageSquare,
  }

  const activityColors = {
    email_sent: 'text-blue-600 bg-blue-100',
    email_opened: 'text-green-600 bg-green-100',
    email_clicked: 'text-purple-600 bg-purple-100',
    email_replied: 'text-orange-600 bg-orange-100',
    call_made: 'text-teal-600 bg-teal-100',
    call_answered: 'text-emerald-600 bg-emerald-100',
    meeting_booked: 'text-pink-600 bg-pink-100',
    sms_sent: 'text-indigo-600 bg-indigo-100',
    sms_replied: 'text-violet-600 bg-violet-100',
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Engagement Tracking"
            description="Monitor lead engagement and interaction history"
          />
          <div className="flex gap-2">
            <Button variant={timeFilter === '24h' ? 'default' : 'outline'} size="sm" onClick={() => setTimeFilter('24h')}>
              24h
            </Button>
            <Button variant={timeFilter === '7d' ? 'default' : 'outline'} size="sm" onClick={() => setTimeFilter('7d')}>
              7d
            </Button>
            <Button variant={timeFilter === '30d' ? 'default' : 'outline'} size="sm" onClick={() => setTimeFilter('30d')}>
              30d
            </Button>
            <Button variant={timeFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setTimeFilter('all')}>
              All
            </Button>
          </div>
        </div>
        <Separator />

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Activities"
            value={stats.totalActivities}
            icon={MessageSquare}
            description={`${stats.last24Hours} in last 24h`}
          />
          <MetricCard
            title="Emails Sent"
            value={stats.emailsSent}
            icon={Mail}
            description={`${stats.emailsOpened} opened`}
            trend={{ value: 8.2, isPositive: true }}
          />
          <MetricCard
            title="Calls Made"
            value={stats.callsMade}
            icon={Phone}
            description="Outbound calls"
          />
          <MetricCard
            title="Meetings Booked"
            value={stats.meetingsBooked}
            icon={Calendar}
            description="From engagement"
            trend={{ value: 15.3, isPositive: true }}
          />
        </div>

        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
            <TabsTrigger value="heatmap">Engagement Heatmap</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEngagementActivities.map((activity, index) => {
                    const Icon = activityIcons[activity.type]
                    const colorClass = activityColors[activity.type]

                    return (
                      <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                        <div className="relative flex flex-col items-center">
                          <div className={`rounded-full p-2 ${colorClass}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          {index < mockEngagementActivities.length - 1 && (
                            <div className="w-px h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{activity.leadName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {activity.channel}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {activity.type.replace(/_/g, ' ')}
                                {activity.subject && ` - ${activity.subject}`}
                              </p>
                              {activity.metadata && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  {Object.entries(activity.metadata).map(([key, value]) => (
                                    <span key={key} className="mr-3">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            By {activity.performedBy}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Time of Day Heatmap */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Activity by Time of Day</h3>
                    <div className="grid grid-cols-12 gap-1">
                      {Array.from({ length: 24 }, (_, hour) => {
                        const activity = Math.floor(Math.random() * 100)
                        return (
                          <div
                            key={hour}
                            className="aspect-square rounded"
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${activity / 100})`,
                            }}
                            title={`${hour}:00 - ${activity} activities`}
                          />
                        )
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>12 AM</span>
                      <span>6 AM</span>
                      <span>12 PM</span>
                      <span>6 PM</span>
                      <span>11 PM</span>
                    </div>
                  </div>

                  {/* Day of Week Heatmap */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Activity by Day of Week</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                        const activity = Math.floor(Math.random() * 100)
                        return (
                          <div key={day} className="text-center">
                            <div
                              className="h-20 rounded mb-2"
                              style={{
                                backgroundColor: `rgba(59, 130, 246, ${activity / 100})`,
                              }}
                            />
                            <span className="text-xs text-muted-foreground">{day}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'Emails Sent', count: stats.emailsSent, color: 'bg-blue-500' },
                      { type: 'Emails Opened', count: stats.emailsOpened, color: 'bg-green-500' },
                      { type: 'Emails Replied', count: stats.emailsReplied, color: 'bg-purple-500' },
                      { type: 'Calls Made', count: stats.callsMade, color: 'bg-orange-500' },
                      { type: 'Meetings Booked', count: stats.meetingsBooked, color: 'bg-pink-500' },
                    ].map((item) => (
                      <div key={item.type} className="flex items-center gap-3">
                        <div className="w-32 text-sm font-medium">{item.type}</div>
                        <div className="flex-1">
                          <div className="h-6 bg-muted rounded-md overflow-hidden">
                            <div
                              className={`h-full ${item.color} flex items-center px-3 text-white text-sm`}
                              style={{ width: `${(item.count / stats.totalActivities) * 100}%` }}
                            >
                              {item.count}
                            </div>
                          </div>
                        </div>
                        <div className="w-12 text-sm text-right">
                          {((item.count / stats.totalActivities) * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { stage: 'Emails Sent', count: stats.emailsSent, percentage: 100 },
                      { stage: 'Opened', count: stats.emailsOpened, percentage: (stats.emailsOpened / stats.emailsSent) * 100 },
                      { stage: 'Clicked', count: Math.floor(stats.emailsOpened * 0.4), percentage: (stats.emailsOpened * 0.4 / stats.emailsSent) * 100 },
                      { stage: 'Replied', count: stats.emailsReplied, percentage: (stats.emailsReplied / stats.emailsSent) * 100 },
                      { stage: 'Booked', count: stats.meetingsBooked, percentage: (stats.meetingsBooked / stats.emailsSent) * 100 },
                    ].map((item, index) => (
                      <div key={item.stage} className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.stage}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} ({item.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div
                          className="h-10 rounded-md flex items-center px-4 text-white font-medium"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: `rgba(59, 130, 246, ${1 - index * 0.15})`,
                          }}
                        >
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

