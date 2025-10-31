import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Plus, Mail, TrendingUp, Users } from 'lucide-react'
import { mockNurtureCampaigns } from '@/lib/mock-data/crm-campaigns'
import { NurtureCampaignsTable } from './components/nurture-table'
import { MetricCard } from '@/components/crm/metric-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function NurtureCampaignsPage() {
  const totalEmailsSent = mockNurtureCampaigns.reduce((sum, c) => sum + c.emailsSent, 0)
  const totalConversions = mockNurtureCampaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgOpenRate = (mockNurtureCampaigns.reduce((sum, c) => sum + c.opensRate, 0) / mockNurtureCampaigns.length).toFixed(1)
  const avgClickRate = (mockNurtureCampaigns.reduce((sum, c) => sum + c.clicksRate, 0) / mockNurtureCampaigns.length).toFixed(1)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Nurture Campaigns"
            description="Automated email sequences to nurture your leads"
          />
          <Link href="/crm/leads/nurture/new">
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
            title="Active Campaigns"
            value={mockNurtureCampaigns.filter(c => c.status === 'active').length}
            icon={Mail}
            description={`${mockNurtureCampaigns.length} total`}
          />
          <MetricCard
            title="Emails Sent"
            value={totalEmailsSent}
            icon={Users}
            description="All campaigns"
            trend={{ value: 12.4, isPositive: true }}
          />
          <MetricCard
            title="Avg Open Rate"
            value={`${avgOpenRate}%`}
            icon={TrendingUp}
            description="Across campaigns"
            trend={{ value: 2.3, isPositive: true }}
          />
          <MetricCard
            title="Conversions"
            value={totalConversions}
            icon={TrendingUp}
            description={`${((totalConversions / totalEmailsSent) * 100).toFixed(1)}% conv rate`}
            trend={{ value: 5.7, isPositive: true }}
          />
        </div>

        {/* Campaign Performance */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Email Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Open Rate</span>
                    <span className="font-medium">{avgOpenRate}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${avgOpenRate}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Click Rate</span>
                    <span className="font-medium">{avgClickRate}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${avgClickRate}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Conversion Rate</span>
                    <span className="font-medium">
                      {((totalConversions / totalEmailsSent) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(totalConversions / totalEmailsSent) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...mockNurtureCampaigns]
                  .sort((a, b) => b.conversionRate - a.conversionRate)
                  .slice(0, 5)
                  .map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {campaign.conversions} conversions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                          {campaign.conversionRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">conv rate</p>
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
            <NurtureCampaignsTable data={mockNurtureCampaigns} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

