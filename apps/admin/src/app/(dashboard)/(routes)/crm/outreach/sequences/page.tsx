import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Plus, Users, MessageSquare, Calendar } from 'lucide-react'
import { mockSequences, getSequenceStats } from '@/lib/mock-data/crm-sequences'
import { SequencesTable } from './components/sequences-table'
import { MetricCard } from '@/components/crm/metric-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SequencesPage() {
  const stats = getSequenceStats()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Outreach Sequences"
            description="Manage automated outreach sequences and track performance"
          />
          <Link href="/crm/outreach/sequences/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Sequence
            </Button>
          </Link>
        </div>
        <Separator />

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Active Sequences"
            value={stats.activeSequences}
            icon={MessageSquare}
            description={`${stats.totalSequences} total`}
          />
          <MetricCard
            title="Enrolled Contacts"
            value={stats.totalEnrolled}
            icon={Users}
            description="Currently in sequences"
            trend={{ value: 8.3, isPositive: true }}
          />
          <MetricCard
            title="Avg Reply Rate"
            value={`${stats.averageReplyRate}%`}
            icon={MessageSquare}
            description={`${stats.totalReplies} replies`}
            trend={{ value: 2.7, isPositive: true }}
          />
          <MetricCard
            title="Meetings Booked"
            value={stats.totalBooked}
            icon={Calendar}
            description={`${stats.averageBookingRate}% booking rate`}
            trend={{ value: 4.5, isPositive: true }}
          />
        </div>

        {/* Performance Analysis */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sequence Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSequences
                  .sort((a, b) => b.replyRate - a.replyRate)
                  .slice(0, 5)
                  .map((sequence) => (
                    <div key={sequence.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{sequence.name}</span>
                        <span className="text-sm font-semibold text-green-600">
                          {sequence.replyRate}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${sequence.replyRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-16 text-right">
                          {sequence.replied}/{sequence.enrolled}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSequences
                  .sort((a, b) => b.bookingRate - a.bookingRate)
                  .slice(0, 5)
                  .map((sequence) => (
                    <div key={sequence.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{sequence.name}</span>
                        <span className="text-sm font-semibold text-purple-600">
                          {sequence.bookingRate}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${sequence.bookingRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-16 text-right">
                          {sequence.booked}/{sequence.enrolled}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sequences by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {[
                { channel: 'Email', count: mockSequences.filter(s => s.channel === 'email').length, color: 'bg-blue-500' },
                { channel: 'LinkedIn', count: mockSequences.filter(s => s.channel === 'linkedin').length, color: 'bg-purple-500' },
                { channel: 'SMS', count: mockSequences.filter(s => s.channel === 'sms').length, color: 'bg-green-500' },
                { channel: 'Call', count: mockSequences.filter(s => s.channel === 'call').length, color: 'bg-orange-500' },
              ].map((item) => (
                <div key={item.channel} className="text-center p-4 rounded-lg border">
                  <div className={`h-2 w-full ${item.color} rounded-full mb-3`} />
                  <div className="text-2xl font-bold">{item.count}</div>
                  <div className="text-sm text-muted-foreground">{item.channel}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Sequences Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Sequences</CardTitle>
          </CardHeader>
          <CardContent>
            <SequencesTable data={mockSequences} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

