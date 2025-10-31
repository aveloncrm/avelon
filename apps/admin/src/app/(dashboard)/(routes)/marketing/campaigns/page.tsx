import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, TrendingUp, Target, DollarSign, Calendar } from 'lucide-react'
import { mockCampaigns, getCampaignStats } from '@/lib/mock-data/marketing-campaigns'
import { getPlatform } from '@/lib/mock-data/marketing-platforms'
import { format } from 'date-fns'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { StatusBadge } from '@/components/crm/status-badge'

export default function CampaignsPage() {
  const stats = getCampaignStats()
  const activeCampaigns = mockCampaigns.filter(c => c.status === 'active')

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Marketing Campaigns"
            description="Create and manage your marketing campaigns"
          />
          <Link href="/marketing/campaigns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>
        <Separator />

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reach</p>
                  <p className="text-3xl font-bold">{(stats.totalReach / 1000).toFixed(0)}K</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-3xl font-bold">${(stats.totalBudget / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                  <p className="text-3xl font-bold">{stats.avgEngagementRate}%</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Campaigns Carousel */}
        {activeCampaigns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {activeCampaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/marketing/campaigns/${campaign.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold mb-1">{campaign.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {campaign.description}
                            </p>
                          </div>
                          <StatusBadge status={campaign.status} />
                        </div>

                        <div className="flex items-center gap-2">
                          {campaign.platforms.map((platformId) => {
                            const platform = getPlatform(platformId)
                            return (
                              <span key={platformId} className="text-lg">
                                {platform.icon}
                              </span>
                            )
                          })}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Reach</p>
                            <p className="font-semibold">{(campaign.metrics.reach / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Engagement</p>
                            <p className="font-semibold">{campaign.metrics.engagementRate}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Conversions</p>
                            <p className="font-semibold">{campaign.metrics.conversions}</p>
                          </div>
                        </div>

                        {campaign.budget && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Budget</span>
                              <span>
                                ${campaign.spent?.toLocaleString()} / ${campaign.budget.toLocaleString()}
                              </span>
                            </div>
                            <Progress
                              value={((campaign.spent || 0) / campaign.budget) * 100}
                              className="h-2"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCampaigns.map((campaign) => (
                <Link key={campaign.id} href={`/marketing/campaigns/${campaign.id}`}>
                  <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <StatusBadge status={campaign.status} />
                        <Badge variant="outline" className="text-xs">
                          {campaign.type.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{format(new Date(campaign.startDate), 'MMM d')} - {format(new Date(campaign.endDate), 'MMM d')}</span>
                        <span>{campaign.postsCount} posts</span>
                        <div className="flex gap-1">
                          {campaign.platforms.map((platformId) => (
                            <span key={platformId}>{getPlatform(platformId).icon}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Reach</p>
                        <p className="text-sm font-semibold">{(campaign.metrics.reach / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                        <p className="text-sm font-semibold">{campaign.metrics.engagementRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Conversions</p>
                        <p className="text-sm font-semibold">{campaign.metrics.conversions}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

