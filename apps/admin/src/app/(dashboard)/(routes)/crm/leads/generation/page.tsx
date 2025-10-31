import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, DollarSign, Users, Target } from 'lucide-react'
import { mockLeadGenCampaigns, getCampaignStats } from '@/lib/mock-data/crm-campaigns'
import { LeadGenTable } from './components/lead-gen-table'
import { MetricCard } from '@/components/crm/metric-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LeadGenerationPage() {
  const stats = getCampaignStats()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Lead Generation"
            description="Manage and track your lead generation campaigns"
          />
          <Link href="/crm/leads/generation/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>
        <Separator />

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Campaigns"
            value={stats.totalCampaigns}
            icon={Target}
            description={`${stats.activeCampaigns} active`}
          />
          <MetricCard
            title="Leads Generated"
            value={stats.totalLeads}
            icon={Users}
            description="All time"
            trend={{ value: 15.3, isPositive: true }}
          />
          <MetricCard
            title="Qualification Rate"
            value={`${stats.qualificationRate}%`}
            icon={TrendingUp}
            description="Qualified leads"
            trend={{ value: 4.2, isPositive: true }}
          />
          <MetricCard
            title="Avg Cost Per Lead"
            value={`$${stats.averageCostPerLead}`}
            icon={DollarSign}
            description="Across all campaigns"
          />
        </div>

        {/* Campaign Performance Chart */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Leads by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { source: 'Email Campaigns', count: 145, percentage: 32, color: 'bg-blue-500' },
                  { source: 'Social Media', count: 98, percentage: 22, color: 'bg-purple-500' },
                  { source: 'Paid Ads', count: 87, percentage: 19, color: 'bg-green-500' },
                  { source: 'Content Marketing', count: 76, percentage: 17, color: 'bg-yellow-500' },
                  { source: 'Events', count: 45, percentage: 10, color: 'bg-orange-500' },
                ].map((item) => (
                  <div key={item.source} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.source}</span>
                      <span className="text-muted-foreground">{item.count} leads</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { stage: 'Total Leads', count: 451, percentage: 100, color: 'bg-blue-500' },
                  { stage: 'Engaged', count: 312, percentage: 69, color: 'bg-green-500' },
                  { stage: 'Qualified', count: 189, percentage: 42, color: 'bg-yellow-500' },
                  { stage: 'Opportunity', count: 87, percentage: 19, color: 'bg-orange-500' },
                  { stage: 'Customer', count: 34, percentage: 8, color: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.stage} className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium">{item.stage}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-muted rounded-md overflow-hidden">
                        <div
                          className={`h-full ${item.color} flex items-center px-3 text-white text-sm font-medium`}
                          style={{ width: `${item.percentage}%` }}
                        >
                          {item.count}
                        </div>
                      </div>
                    </div>
                    <div className="w-12 text-sm text-muted-foreground text-right">
                      {item.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadGenTable data={mockLeadGenCampaigns} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

