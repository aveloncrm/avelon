import { getCampaignById } from '@/lib/mock-data/marketing-campaigns'
import { mockPosts } from '@/lib/mock-data/marketing-posts'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/crm/status-badge'
import { getPlatform } from '@/lib/mock-data/marketing-platforms'
import { Progress } from '@/components/ui/progress'
import { Edit, Pause, Play, Share, TrendingUp, Users, MousePointer, Target } from 'lucide-react'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'

export default async function CampaignDetailPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params
  const campaign = getCampaignById(campaignId)

  if (!campaign) {
    redirect('/marketing/campaigns')
  }

  const campaignPosts = mockPosts.filter(p => p.campaignId === campaign.id)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heading title={campaign.name} description="" />
              <StatusBadge status={campaign.status} />
            </div>
            <p className="text-muted-foreground">{campaign.description}</p>
          </div>
          <div className="flex gap-2">
            {campaign.status === 'active' ? (
              <Button variant="outline">
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            ) : (
              <Button variant="outline">
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
            )}
            <Button variant="outline">
              <Share className="mr-2 h-4 w-4" />
              Share Report
            </Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Campaign
            </Button>
          </div>
        </div>
        <Separator />

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reach</p>
                  <p className="text-2xl font-bold">{(campaign.metrics.reach / 1000).toFixed(0)}K</p>
                </div>
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Impressions</p>
                  <p className="text-2xl font-bold">{(campaign.metrics.impressions / 1000).toFixed(0)}K</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                  <p className="text-2xl font-bold">{campaign.metrics.engagementRate}%</p>
                </div>
                <MousePointer className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="text-2xl font-bold">{(campaign.metrics.clicks / 1000).toFixed(1)}K</p>
                </div>
                <MousePointer className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-2xl font-bold">{campaign.metrics.conversions}</p>
                </div>
                <Target className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content ({campaignPosts.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Campaign Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{campaign.type.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {format(new Date(campaign.startDate), 'MMM d, yyyy')} -{' '}
                      {format(new Date(campaign.endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Platforms</p>
                    <div className="flex gap-2 mt-1">
                      {campaign.platforms.map((platformId) => {
                        const platform = getPlatform(platformId)
                        return (
                          <Badge key={platformId} variant="outline">
                            <span className="mr-1">{platform.icon}</span>
                            {platform.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaign.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget & Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget & Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaign.budget && (
                    <>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Budget Spent</span>
                          <span className="font-medium">
                            ${campaign.spent?.toLocaleString()} / ${campaign.budget.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={((campaign.spent || 0) / campaign.budget) * 100} className="h-3" />
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Engagement Rate</span>
                      <span className="font-medium">{campaign.metrics.engagementRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      <span className="font-medium">{campaign.metrics.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Posts Published</span>
                      <span className="font-medium">{campaign.postsCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Goals */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Campaign Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {campaign.goals.map((goal, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaignPosts.map((post) => (
                    <div key={post.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex gap-1">
                        {post.platforms.map((platformId) => (
                          <span key={platformId} className="text-lg">
                            {getPlatform(platformId).icon}
                          </span>
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm mb-2 line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <StatusBadge status={post.status} />
                          {post.publishedAt && (
                            <span>{format(new Date(post.publishedAt), 'MMM d, h:mm a')}</span>
                          )}
                          {post.engagement && (
                            <>
                              <span>{post.engagement.likes} likes</span>
                              <span>{post.engagement.comments} comments</span>
                              <span>{post.engagement.engagementRate}% engagement</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-24 text-sm text-muted-foreground">
                      {format(new Date(campaign.createdAt), 'MMM d')}
                    </div>
                    <div className="flex-1 pb-4 border-l-2 pl-4">
                      <p className="font-medium">Campaign Created</p>
                      <p className="text-sm text-muted-foreground">By {campaign.createdBy}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-24 text-sm text-muted-foreground">
                      {format(new Date(campaign.startDate), 'MMM d')}
                    </div>
                    <div className="flex-1 pb-4 border-l-2 pl-4">
                      <p className="font-medium">Campaign Started</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

