import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { MetricCard } from '@/components/crm/metric-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  ArrowUpRight,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  
} from 'lucide-react'
import { getLeadStats, getDealStats, getContactStats, getConversionFunnel, mockActivities, getAllEnrichedLeads } from '@/lib/mock-data/crm-unified'
import { getCampaignStats } from '@/lib/mock-data/crm-campaigns'
import { getSequenceStats } from '@/lib/mock-data/crm-sequences'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { getLeadScoreCategory, isLeadUntouched } from '@/lib/lead-scoring-utils'

export default function CRMDashboardPage() {
  const leadStats = getLeadStats()
  const dealStats = getDealStats()
  const contactStats = getContactStats()
  const funnel = getConversionFunnel()
  const campaignStats = getCampaignStats()
  const sequenceStats = getSequenceStats()

  // Get all leads for classification stats
  const allLeads = getAllEnrichedLeads()
  const hotLeads = allLeads.filter(l => getLeadScoreCategory(l.score) === 'hot').length
  const warmLeads = allLeads.filter(l => getLeadScoreCategory(l.score) === 'warm').length
  const coldLeads = allLeads.filter(l => getLeadScoreCategory(l.score) === 'cold').length
  const untouchedLeads = allLeads.filter(l => isLeadUntouched(l.lastContactedAt)).length
  const urgentLeads = allLeads.filter(l => l.priority === 'urgent').length

  const conversionRate = ((leadStats.converted / leadStats.total) * 100).toFixed(1)
  const recentActivities = mockActivities.slice(0, 10).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Sales CRM Dashboard"
            description="Monitor your sales pipeline and team performance"
          />
          <div className="flex gap-2">
            <Link href="/crm/leads/new">
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Add Lead
              </Button>
            </Link>
          </div>
        </div>
        <Separator />

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/crm/contacts" className="block">
            <MetricCard
              title="Total Contacts"
              value={contactStats.total}
              icon={Users}
              description={`${leadStats.new} new leads this month`}
              trend={{ value: 12.5, isPositive: true }}
            />
          </Link>
          <Link href="/crm/leads" className="block">
            <MetricCard
              title="Active Leads"
              value={leadStats.total - leadStats.converted}
              icon={TrendingUp}
              description={`${conversionRate}% conversion rate`}
              trend={{ value: 3.2, isPositive: true }}
            />
          </Link>
          <Link href="/crm/pipeline" className="block">
            <MetricCard
              title="Active Deals"
              value={dealStats.active}
              icon={Target}
              description={`$${(dealStats.pipelineValue / 1000).toFixed(0)}K in pipeline`}
            />
          </Link>
          <MetricCard
            title="Revenue Pipeline"
            value={`$${(dealStats.weightedPipelineValue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            description="Weighted by probability"
            trend={{ value: 8.4, isPositive: true }}
          />
        </div>

        {/* Lead Classification Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Classification</CardTitle>
            <CardDescription>Current lead distribution by score and priority</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <Link href="/crm/leads">
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-red-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">🔥</div>
                    <div className="text-2xl font-bold text-red-600">{hotLeads}</div>
                    <div className="text-sm text-muted-foreground">Hot Leads</div>
                    <div className="text-xs text-muted-foreground mt-1">Score ≥80</div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/crm/leads">
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">🌡️</div>
                    <div className="text-2xl font-bold text-yellow-600">{warmLeads}</div>
                    <div className="text-sm text-muted-foreground">Warm Leads</div>
                    <div className="text-xs text-muted-foreground mt-1">Score 60-79</div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/crm/leads">
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">❄️</div>
                    <div className="text-2xl font-bold text-blue-600">{coldLeads}</div>
                    <div className="text-sm text-muted-foreground">Cold Leads</div>
                    <div className="text-xs text-muted-foreground mt-1">Score &lt;60</div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/crm/leads">
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">👁️</div>
                    <div className="text-2xl font-bold text-gray-600">{untouchedLeads}</div>
                    <div className="text-sm text-muted-foreground">Untouched</div>
                    <div className="text-xs text-muted-foreground mt-1">Never contacted</div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/crm/leads">
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-red-300 bg-red-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">🚨</div>
                    <div className="text-2xl font-bold text-red-700">{urgentLeads}</div>
                    <div className="text-sm text-muted-foreground">Urgent</div>
                    <div className="text-xs text-muted-foreground mt-1">High priority</div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Conversion Funnel</CardTitle>
            <CardDescription>Track your customer journey from contact to customer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Funnel Stages */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: 'Contacts', count: funnel.contacts, rate: 100, href: '/crm/contacts' },
                  { label: 'Leads', count: funnel.leads, rate: funnel.conversionRates.contactToLead, href: '/crm/leads' },
                  { label: 'Qualified', count: funnel.qualifiedLeads, rate: funnel.conversionRates.leadToQualified, href: '/crm/leads' },
                  { label: 'Deals', count: funnel.deals, rate: funnel.conversionRates.qualifiedToDeal, href: '/crm/pipeline' },
                  { label: 'Customers', count: funnel.customers, rate: funnel.conversionRates.dealToCustomer, href: '/crm/contacts' },
                ].map((stage, index) => (
                  <Link key={stage.label} href={stage.href}>
                    <div className="relative">
                      <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-b from-white to-gray-50">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl font-bold text-primary mb-1">
                            {stage.count}
                          </div>
                          <div className="text-sm font-medium mb-2">{stage.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {stage.rate.toFixed(1)}%
                          </div>
                        </CardContent>
                      </Card>
                      {index < 4 && (
                        <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Conversion Rates */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Contact → Lead</span>
                    <span className="text-sm font-semibold">
                      {funnel.conversionRates.contactToLead.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={funnel.conversionRates.contactToLead} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Lead → Qualified</span>
                    <span className="text-sm font-semibold">
                      {funnel.conversionRates.leadToQualified.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={funnel.conversionRates.leadToQualified} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Qualified → Deal</span>
                    <span className="text-sm font-semibold">
                      {funnel.conversionRates.qualifiedToDeal.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={funnel.conversionRates.qualifiedToDeal} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Deal → Customer</span>
                    <span className="text-sm font-semibold">
                      {funnel.conversionRates.dealToCustomer.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={funnel.conversionRates.dealToCustomer} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Pipeline by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: 'Discovery', count: dealStats.total - dealStats.active, value: 120000, color: 'bg-blue-500' },
                  { stage: 'Proposal', count: 3, value: 180000, color: 'bg-yellow-500' },
                  { stage: 'Negotiation', count: 2, value: 110000, color: 'bg-orange-500' },
                  { stage: 'Decision', count: 2, value: 70000, color: 'bg-purple-500' },
                  { stage: 'Won', count: dealStats.wonDeals, value: dealStats.wonValue, color: 'bg-green-500' },
                ].map((item) => (
                  <div key={item.stage} className="flex items-center">
                    <div className="w-32 text-sm font-medium">{item.stage}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
                          <div
                            className={`h-full ${item.color} flex items-center px-3 text-white text-sm font-medium`}
                            style={{ width: `${(item.value / dealStats.totalValue) * 100}%` }}
                          >

                          </div>
                        </div>
                        <div className="w-24 text-sm font-semibold text-right">
                          ${(item.value / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Lead Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { status: 'New', count: leadStats.new, color: 'bg-blue-500' },
                  { status: 'Contacted', count: leadStats.contacted, color: 'bg-yellow-500' },
                  { status: 'Qualified', count: leadStats.qualified, color: 'bg-green-500' },
                  { status: 'Unqualified', count: leadStats.unqualified, color: 'bg-gray-500' },
                  { status: 'Converted', count: leadStats.converted, color: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">
                        {((item.count / leadStats.total) * 100).toFixed(0)}%
                      </div>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance & Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Campaign Performance</CardTitle>
                <Link href="/crm/leads/generation">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Total Campaigns</p>
                    <p className="text-2xl font-bold">{campaignStats.totalCampaigns}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-xl font-semibold text-green-600">
                      {campaignStats.activeCampaigns}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Leads Generated</span>
                    <span className="font-medium">{campaignStats.totalLeads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Qualified Rate</span>
                    <span className="font-medium">{campaignStats.qualificationRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Cost/Lead</span>
                    <span className="font-medium">${campaignStats.averageCostPerLead}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon =
                    activity.type === 'email'
                      ? Mail
                      : activity.type === 'call'
                        ? Phone
                        : Calendar

                  return (
                    <div key={activity.id} className="flex items-start gap-3 text-sm">
                      <div className="rounded-full bg-muted p-2">
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.createdAt), 'MMM d, h:mm a')} •{' '}
                          {activity.createdBy}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outreach Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Sequences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{sequenceStats.activeSequences}</div>
                <p className="text-sm text-muted-foreground">
                  {sequenceStats.totalEnrolled} contacts enrolled
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reply Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{sequenceStats.averageReplyRate}%</div>
                <p className="text-sm text-muted-foreground">
                  {sequenceStats.totalReplies} total replies
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Booking Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{sequenceStats.averageBookingRate}%</div>
                <p className="text-sm text-muted-foreground">
                  {sequenceStats.totalBooked} meetings booked
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

