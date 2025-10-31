'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Users,
    TrendingUp,
    
    
    Heart,
    
    
    Download,
    Target,
    BarChart3,
    ArrowRight,
    Instagram,
    Facebook,
    Twitter,
    Linkedin
} from 'lucide-react'
import {
    getOverallMetrics,
    mockPlatformMetrics
} from '@/lib/mock-data/marketing-analytics'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export default function MarketingReportsPage() {
    const [dateRange, setDateRange] = useState('30d')
    const [reportType, setReportType] = useState('overview')

    const metrics = getOverallMetrics()
    const platforms = mockPlatformMetrics

    // Mock data for detailed reports
    const topPosts = [
        {
            platform: 'Instagram',
            content: 'Product launch announcement',
            engagement: 1850,
            reach: 12500,
            engagementRate: 14.8,
            date: '2025-01-15'
        },
        {
            platform: 'LinkedIn',
            content: 'Customer success story',
            engagement: 1620,
            reach: 9500,
            engagementRate: 17.1,
            date: '2025-01-18'
        },
        {
            platform: 'Twitter',
            content: 'Industry insights',
            engagement: 980,
            reach: 8200,
            engagementRate: 12.0,
            date: '2025-01-20'
        },
    ]

    const campaignPerformance = [
        { name: 'Q1 Product Launch', reach: 450000, engagement: 125000, conversion: 850, roas: 3.5, status: 'active' },
        { name: 'Summer Sale', reach: 380000, engagement: 98000, conversion: 620, roas: 2.8, status: 'active' },
        { name: 'Brand Awareness', reach: 520000, engagement: 145000, conversion: 320, roas: 1.2, status: 'completed' },
        { name: 'New Feature Release', reach: 290000, engagement: 78000, conversion: 420, roas: 2.1, status: 'completed' },
    ]

    const contentTypes = [
        { type: 'Video', posts: 12, engagement: 34200, avgEngagement: 2850 },
        { type: 'Image', posts: 45, engagement: 55800, avgEngagement: 1240 },
        { type: 'Carousel', posts: 18, engagement: 30240, avgEngagement: 1680 },
        { type: 'Text', posts: 28, engagement: 24920, avgEngagement: 890 },
    ]

    const audienceGrowth = [
        { month: 'Jan', followers: 85000, growth: 2100 },
        { month: 'Feb', followers: 87200, growth: 2200 },
        { month: 'Mar', followers: 89400, growth: 1800 },
        { month: 'Apr', followers: 91200, growth: 2400 },
        { month: 'May', followers: 93600, growth: 2200 },
        { month: 'Jun', followers: 95800, growth: 2100 },
    ]

    const hashtagPerformance = [
        { hashtag: '#ProductLaunch', posts: 15, reach: 125000, engagement: 8500 },
        { hashtag: '#AI', posts: 28, reach: 245000, engagement: 12800 },
        { hashtag: '#Innovation', posts: 22, reach: 185000, engagement: 9200 },
        { hashtag: '#Marketing', posts: 18, reach: 142000, engagement: 6800 },
    ]

    const platformIcons: Record<string, any> = {
        Instagram: Instagram,
        Facebook: Facebook,
        Twitter: Twitter,
        LinkedIn: Linkedin,
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Marketing Reports"
                        description="Comprehensive social media and campaign performance analysis"
                    />
                    <div className="flex gap-2">
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">Last 30 days</SelectItem>
                                <SelectItem value="90d">Last 90 days</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </Button>
                    </div>
                </div>
                <Separator />

                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(metrics.reach / 1000).toFixed(0)}K</div>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{metrics.reachGrowth}% growth
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.engagementRate}%</div>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{metrics.engagementRateChange}% from last period
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(metrics.followers / 1000).toFixed(1)}K</div>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{metrics.followerGrowth}% growth
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Best Platform</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold capitalize">{metrics.bestPlatform}</div>
                            <p className="text-xs text-muted-foreground">Highest engagement</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="platforms">Platform Performance</TabsTrigger>
                        <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                        <TabsTrigger value="content">Content Analysis</TabsTrigger>
                        <TabsTrigger value="audience">Audience Growth</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Platform Performance Summary</CardTitle>
                                    <Link href="/marketing/analytics">
                                        <Button variant="ghost" size="sm">
                                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {platforms.map((platform) => {
                                        const Icon = platformIcons[platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)] || BarChart3
                                        return (
                                            <div key={platform.platform} className="space-y-2 p-4 rounded-lg border">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Icon className="h-5 w-5 text-blue-600" />
                                                        <span className="font-medium capitalize">{platform.platform}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold">{platform.engagementRate}% engagement</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground">Reach</p>
                                                        <p className="font-semibold">{(platform.reach / 1000).toFixed(0)}K</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Engagement</p>
                                                        <p className="font-semibold">{(platform.engagement / 1000).toFixed(1)}K</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Followers</p>
                                                        <p className="font-semibold">{(platform.followers / 1000).toFixed(1)}K</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {topPosts.map((post, index) => {
                                        const Icon = platformIcons[post.platform] || BarChart3
                                        return (
                                            <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Icon className="h-4 w-4" />
                                                            <span className="font-medium">{post.content}</span>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">{post.date}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">{post.engagement.toLocaleString()}</div>
                                                    <div className="text-xs text-muted-foreground">{post.engagementRate}% rate</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Platform Performance Tab */}
                    <TabsContent value="platforms" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {platforms.map((platform) => {
                                const Icon = platformIcons[platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)] || BarChart3
                                return (
                                    <Card key={platform.platform}>
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <Icon className="h-6 w-6" />
                                                <CardTitle className="capitalize">{platform.platform}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Reach</p>
                                                    <p className="text-2xl font-bold">{(platform.reach / 1000).toFixed(0)}K</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Impressions</p>
                                                    <p className="text-2xl font-bold">{(platform.impressions / 1000).toFixed(0)}K</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Engagement</p>
                                                    <p className="text-2xl font-bold">{(platform.engagement / 1000).toFixed(1)}K</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                                                    <p className="text-2xl font-bold">{platform.engagementRate}%</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Followers</p>
                                                <p className="text-2xl font-bold">{(platform.followers / 1000).toFixed(1)}K</p>
                                            </div>
                                            <div className="pt-3 border-t">
                                                <p className="text-sm text-muted-foreground mb-2">Top Post</p>
                                                <p className="font-medium text-sm">{platform.topPost.content}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {platform.topPost.engagement.toLocaleString()} engagements
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </TabsContent>

                    {/* Campaigns Tab */}
                    <TabsContent value="campaigns" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Active Campaigns</CardTitle>
                                    <Link href="/marketing/campaigns">
                                        <Button variant="ghost" size="sm">
                                            View All <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {campaignPerformance.map((campaign) => (
                                        <div key={campaign.name} className="p-4 rounded-lg border space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">{campaign.name}</div>
                                                    <div className="text-sm text-muted-foreground">Reach: {(campaign.reach / 1000).toFixed(0)}K</div>
                                                </div>
                                                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                                                    {campaign.status}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Engagement</p>
                                                    <p className="font-semibold">{(campaign.engagement / 1000).toFixed(0)}K</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Conversions</p>
                                                    <p className="font-semibold">{campaign.conversion}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">ROAS</p>
                                                    <p className="font-semibold text-green-600">{campaign.roas}x</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Engagement Rate</p>
                                                    <p className="font-semibold">
                                                        {((campaign.engagement / campaign.reach) * 100).toFixed(1)}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Total Campaign Reach</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">1.64M</div>
                                    <p className="text-sm text-muted-foreground mt-2">Across all campaigns</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">451K</div>
                                    <p className="text-sm text-muted-foreground mt-2">27.5% engagement rate</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">2,210</div>
                                    <p className="text-sm text-muted-foreground mt-2">0.13% conversion rate</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Content Analysis Tab */}
                    <TabsContent value="content" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Type Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {contentTypes.map((content) => (
                                        <div key={content.type} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{content.type}</span>
                                                <span className="text-muted-foreground">{content.posts} posts</span>
                                            </div>
                                            <Progress
                                                value={(content.engagement / contentTypes[0].engagement) * 100}
                                                className="h-2"
                                            />
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {content.engagement.toLocaleString()} total engagement
                                                </span>
                                                <span className="font-semibold">
                                                    {content.avgEngagement.toLocaleString()} avg per post
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Hashtag Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {hashtagPerformance.map((item) => (
                                        <div key={item.hashtag} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div>
                                                <div className="font-medium">{item.hashtag}</div>
                                                <div className="text-sm text-muted-foreground">{item.posts} posts</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">{item.engagement.toLocaleString()}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {(item.reach / 1000).toFixed(0)}K reach
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Audience Growth Tab */}
                    <TabsContent value="audience" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Follower Growth Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {audienceGrowth.map((month) => (
                                        <div key={month.month} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{month.month}</span>
                                                <div className="flex gap-4">
                                                    <span className="font-medium">{(month.followers / 1000).toFixed(0)}K</span>
                                                    <span className="text-green-600">+{month.growth}</span>
                                                </div>
                                            </div>
                                            <Progress
                                                value={((month.followers - audienceGrowth[0].followers) / (audienceGrowth[audienceGrowth.length - 1].followers - audienceGrowth[0].followers)) * 100}
                                                className="h-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{(metrics.followers / 1000).toFixed(1)}K</div>
                                    <p className="text-sm text-green-600 mt-2">
                                        <TrendingUp className="inline h-4 w-4 mr-1" />
                                        +{metrics.followerGrowth}% this month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">New Followers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">2,100</div>
                                    <p className="text-sm text-muted-foreground mt-2">Average per month</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{metrics.followerGrowth}%</div>
                                    <p className="text-sm text-muted-foreground mt-2">Month over month</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
