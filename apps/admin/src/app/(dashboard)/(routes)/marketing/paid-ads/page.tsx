'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Plus,
    TrendingUp,
    Target,
    DollarSign,
    Calendar,
    Eye,
    MousePointer,
    Users,
    Globe
} from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'

interface AdPlatform {
    id: string
    name: string
    icon: string
    status: 'connected' | 'not_connected'
    campaigns: number
    spend: number
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cpc: number
}

export default function PaidAdsPage() {
    const [platforms] = useState<AdPlatform[]>([
        {
            id: 'google',
            name: 'Google Ads',
            icon: '🔍',
            status: 'connected',
            campaigns: 5,
            spend: 12500,
            impressions: 245000,
            clicks: 4200,
            conversions: 156,
            ctr: 1.71,
            cpc: 2.98
        },
        {
            id: 'meta',
            name: 'Meta Ads',
            icon: '📘',
            status: 'connected',
            campaigns: 8,
            spend: 18900,
            impressions: 512000,
            clicks: 8900,
            conversions: 234,
            ctr: 1.74,
            cpc: 2.12
        },
        {
            id: 'linkedin',
            name: 'LinkedIn Ads',
            icon: '💼',
            status: 'not_connected',
            campaigns: 0,
            spend: 0,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            cpc: 0
        }
    ])

    const totalStats = platforms.reduce((acc, platform) => ({
        campaigns: acc.campaigns + platform.campaigns,
        spend: acc.spend + platform.spend,
        impressions: acc.impressions + platform.impressions,
        clicks: acc.clicks + platform.clicks,
        conversions: acc.conversions + platform.conversions
    }), { campaigns: 0, spend: 0, impressions: 0, clicks: 0, conversions: 0 })

    const overallCTR = totalStats.impressions > 0
        ? ((totalStats.clicks / totalStats.impressions) * 100).toFixed(2)
        : 0
    const overallCPC = totalStats.clicks > 0
        ? (totalStats.spend / totalStats.clicks).toFixed(2)
        : 0

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Heading
                            title="Paid Advertising"
                            description="Create and manage your paid ad campaigns across platforms"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            Manage Google Ads, Meta Ads, and LinkedIn Ads campaigns all in one place
                        </p>
                    </div>
                </div>
                <Separator />

                {/* Overall Stats */}
                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStats.campaigns}</div>
                            <p className="text-xs text-muted-foreground">Active across all platforms</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${(totalStats.spend / 1000).toFixed(1)}K</div>
                            <p className="text-xs text-muted-foreground">This month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(totalStats.impressions / 1000).toFixed(0)}K</div>
                            <p className="text-xs text-muted-foreground">
                                {overallCTR}% CTR
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStats.conversions}</div>
                            <p className="text-xs text-muted-foreground">Total conversions</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Avg. CPC</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${overallCPC}</div>
                            <p className="text-xs text-muted-foreground">Cost per click</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Platform Tabs */}
                <Tabs defaultValue="google" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="google">Google Ads</TabsTrigger>
                        <TabsTrigger value="meta">Meta Ads</TabsTrigger>
                        <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
                    </TabsList>

                    {/* Google Ads */}
                    <TabsContent value="google" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">🔍</div>
                                        <div>
                                            <CardTitle>Google Ads</CardTitle>
                                            <CardDescription>Search and Display Network Advertising</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {platforms[0].status === 'connected' ? (
                                            <Badge className="bg-green-100 text-green-800">Connected</Badge>
                                        ) : (
                                            <Badge variant="outline">Not Connected</Badge>
                                        )}
                                        <Link href="/marketing/paid-ads/google-ads/new">
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create Campaign
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {platforms[0].status === 'connected' ? (
                                    <>
                                        {/* Platform Stats */}
                                        <div className="grid gap-4 md:grid-cols-4">
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Target className="h-4 w-4 text-blue-600" />
                                                    <span className="text-sm text-muted-foreground">Campaigns</span>
                                                </div>
                                                <div className="text-2xl font-bold">{platforms[0].campaigns}</div>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-muted-foreground">Spend</span>
                                                </div>
                                                <div className="text-2xl font-bold">${(platforms[0].spend / 1000).toFixed(1)}K</div>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Eye className="h-4 w-4 text-purple-600" />
                                                    <span className="text-sm text-muted-foreground">Impressions</span>
                                                </div>
                                                <div className="text-2xl font-bold">{(platforms[0].impressions / 1000).toFixed(0)}K</div>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MousePointer className="h-4 w-4 text-orange-600" />
                                                    <span className="text-sm text-muted-foreground">Conversions</span>
                                                </div>
                                                <div className="text-2xl font-bold">{platforms[0].conversions}</div>
                                            </div>
                                        </div>

                                        {/* Performance Metrics */}
                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-semibold mb-3">Performance Metrics</h4>
                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-muted-foreground">Click-through Rate</span>
                                                        <span className="font-semibold">{platforms[0].ctr}%</span>
                                                    </div>
                                                    <Progress value={platforms[0].ctr * 10} className="h-2" />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-muted-foreground">Cost per Click</span>
                                                        <span className="font-semibold">${platforms[0].cpc}</span>
                                                    </div>
                                                    <Progress value={70} className="h-2" />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-muted-foreground">Conversion Rate</span>
                                                        <span className="font-semibold">
                                                            {((platforms[0].conversions / platforms[0].clicks) * 100).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                    <Progress value={(platforms[0].conversions / platforms[0].clicks) * 10} className="h-2" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="flex gap-2">
                                            <Link href="/marketing/paid-ads/google-ads" className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    View All Campaigns
                                                </Button>
                                            </Link>
                                            <Link href="/marketing/paid-ads/google-ads/new">
                                                <Button variant="outline">
                                                    Create New Campaign
                                                </Button>
                                            </Link>
                                            <Button variant="outline">
                                                View Analytics
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="font-semibold mb-2">Connect Your Google Ads Account</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Connect your Google Ads account to start creating and managing campaigns
                                        </p>
                                        <Button>Connect Account</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Meta Ads */}
                    <TabsContent value="meta" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">📘</div>
                                        <div>
                                            <CardTitle>Meta Ads</CardTitle>
                                            <CardDescription>Facebook, Instagram, and Audience Network</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {platforms[1].status === 'connected' ? (
                                            <Badge className="bg-green-100 text-green-800">Connected</Badge>
                                        ) : (
                                            <Badge variant="outline">Not Connected</Badge>
                                        )}
                                        <Link href="/marketing/paid-ads/meta-ads/new">
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create Campaign
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {platforms[1].status === 'connected' ? (
                                    <>
                                        {/* Platform Stats */}
                                        <div className="grid gap-4 md:grid-cols-4">
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Target className="h-4 w-4 text-blue-600" />
                                                    <span className="text-sm text-muted-foreground">Campaigns</span>
                                                </div>
                                                <div className="text-2xl font-bold">{platforms[1].campaigns}</div>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-muted-foreground">Spend</span>
                                                </div>
                                                <div className="text-2xl font-bold">${(platforms[1].spend / 1000).toFixed(1)}K</div>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Eye className="h-4 w-4 text-purple-600" />
                                                    <span className="text-sm text-muted-foreground">Impressions</span>
                                                </div>
                                                <div className="text-2xl font-bold">{(platforms[1].impressions / 1000).toFixed(0)}K</div>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MousePointer className="h-4 w-4 text-orange-600" />
                                                    <span className="text-sm text-muted-foreground">Conversions</span>
                                                </div>
                                                <div className="text-2xl font-bold">{platforms[1].conversions}</div>
                                            </div>
                                        </div>

                                        {/* Performance Metrics */}
                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-semibold mb-3">Performance Metrics</h4>
                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-muted-foreground">Click-through Rate</span>
                                                        <span className="font-semibold">{platforms[1].ctr}%</span>
                                                    </div>
                                                    <Progress value={platforms[1].ctr * 10} className="h-2" />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-muted-foreground">Cost per Click</span>
                                                        <span className="font-semibold">${platforms[1].cpc}</span>
                                                    </div>
                                                    <Progress value={60} className="h-2" />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-muted-foreground">Conversion Rate</span>
                                                        <span className="font-semibold">
                                                            {((platforms[1].conversions / platforms[1].clicks) * 100).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                    <Progress value={(platforms[1].conversions / platforms[1].clicks) * 10} className="h-2" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="flex gap-2">
                                            <Link href="/marketing/paid-ads/meta-ads" className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    View All Campaigns
                                                </Button>
                                            </Link>
                                            <Link href="/marketing/paid-ads/meta-ads/new">
                                                <Button variant="outline">
                                                    Create New Campaign
                                                </Button>
                                            </Link>
                                            <Button variant="outline">
                                                View Analytics
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="font-semibold mb-2">Connect Your Meta Ads Account</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Connect your Facebook Business Manager to start creating and managing campaigns
                                        </p>
                                        <Button>Connect Account</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* LinkedIn Ads */}
                    <TabsContent value="linkedin" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">💼</div>
                                        <div>
                                            <CardTitle>LinkedIn Ads</CardTitle>
                                            <CardDescription>B2B Professional Advertising Platform</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {platforms[2].status === 'connected' ? (
                                            <Badge className="bg-green-100 text-green-800">Connected</Badge>
                                        ) : (
                                            <Badge variant="outline">Not Connected</Badge>
                                        )}
                                        <Link href="/marketing/paid-ads/linkedin-ads/new">
                                            <Button disabled={platforms[2].status !== 'connected'}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create Campaign
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {platforms[2].status === 'connected' ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">No active campaigns yet</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="font-semibold mb-2">Connect Your LinkedIn Ads Account</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Connect your LinkedIn Campaign Manager to start creating B2B ad campaigns
                                        </p>
                                        <Button>Connect Account</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Campaign Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Insights</CardTitle>
                        <CardDescription>
                            Key metrics and trends across all platforms
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">ROAS</span>
                                </div>
                                <div className="text-2xl font-bold">4.2x</div>
                                <p className="text-xs text-muted-foreground mt-1">Return on ad spend</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium">Reach</span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {((platforms[0].impressions + platforms[1].impressions) / 1000).toFixed(0)}K
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Unique users reached</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium">Active Days</span>
                                </div>
                                <div className="text-2xl font-bold">30</div>
                                <p className="text-xs text-muted-foreground mt-1">Days this month</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

