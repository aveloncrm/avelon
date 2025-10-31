import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Plus, Mail, MessageSquare, Phone, TrendingUp } from 'lucide-react'
import { mockSequences, getSequenceStats, getEngagementStats } from '@/lib/mock-data/crm-sequences'
import { MetricCard } from '@/components/crm/metric-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function OutreachPage() {
  const sequenceStats = getSequenceStats()
  const engagementStats = getEngagementStats()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Outreach & Engagement"
            description="Manage outreach campaigns and track engagement"
          />
          <div className="flex gap-2">
            <Link href="/crm/outreach/sequences/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Sequence
              </Button>
            </Link>
          </div>
        </div>
        <Separator />

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Active Sequences"
            value={sequenceStats.activeSequences}
            icon={Mail}
            description={`${sequenceStats.totalEnrolled} contacts enrolled`}
          />
          <MetricCard
            title="Reply Rate"
            value={`${sequenceStats.averageReplyRate}%`}
            icon={MessageSquare}
            description={`${sequenceStats.totalReplies} replies`}
            trend={{ value: 3.5, isPositive: true }}
          />
          <MetricCard
            title="Booking Rate"
            value={`${sequenceStats.averageBookingRate}%`}
            icon={TrendingUp}
            description={`${sequenceStats.totalBooked} meetings`}
            trend={{ value: 5.2, isPositive: true }}
          />
          <MetricCard
            title="Recent Activity"
            value={engagementStats.last24Hours}
            icon={Phone}
            description="Last 24 hours"
          />
        </div>

        {/* Channel Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Outreach by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {[
                { channel: 'Email', icon: Mail, count: engagementStats.emailsSent, color: 'text-blue-600' },
                { channel: 'Phone', icon: Phone, count: engagementStats.callsMade, color: 'text-green-600' },
                { channel: 'SMS', icon: MessageSquare, count: 48, color: 'text-purple-600' },
                { channel: 'LinkedIn', icon: TrendingUp, count: 156, color: 'text-orange-600' },
              ].map((item) => (
                <div key={item.channel} className="text-center p-4 rounded-lg border">
                  <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                  <div className="text-2xl font-bold">{item.count}</div>
                  <div className="text-sm text-muted-foreground">{item.channel}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Sequences & Performance */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Sequences</CardTitle>
                <Link href="/crm/outreach/sequences">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSequences
                  .filter(s => s.status === 'active')
                  .map((sequence) => (
                    <div key={sequence.id} className="flex items-start justify-between p-3 rounded-lg border">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{sequence.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {sequence.channel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{sequence.enrolled} enrolled</span>
                          <span>{sequence.active} active</span>
                          <span>{sequence.steps.length} steps</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">
                          {sequence.replyRate}% reply
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sequence.replied} replies
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Emails Sent</span>
                    <span className="font-medium">{engagementStats.emailsSent}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Emails Opened</span>
                    <span className="font-medium">
                      {engagementStats.emailsOpened} ({((engagementStats.emailsOpened / engagementStats.emailsSent) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(engagementStats.emailsOpened / engagementStats.emailsSent) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Emails Replied</span>
                    <span className="font-medium">
                      {engagementStats.emailsReplied} ({((engagementStats.emailsReplied / engagementStats.emailsSent) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(engagementStats.emailsReplied / engagementStats.emailsSent) * 100}%` }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Calls Made</span>
                    <span className="font-medium">{engagementStats.callsMade}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Meetings Booked</span>
                    <span className="font-medium">{engagementStats.meetingsBooked}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/crm/outreach/sequences" className="block">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <Mail className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Manage Sequences</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and edit email sequences
                  </p>
                </div>
              </Link>

              <Link href="/crm/outreach/engagement" className="block">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Track Engagement</h3>
                  <p className="text-sm text-muted-foreground">
                    View engagement activity and metrics
                  </p>
                </div>
              </Link>

              <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Manage email and message templates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

