'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/crm/metric-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    TrendingUp,
    DollarSign,
    
    Target,
    
    
    Download,
    
    ArrowRight,
    Activity,
    Mail,
    Phone,
    MessageSquare
} from 'lucide-react'
import {
    getLeadStats,
    getDealStats,
    getContactStats,
    getConversionFunnel
} from '@/lib/mock-data/crm-unified'
import { getSequenceStats } from '@/lib/mock-data/crm-sequences'
import { getOverallMetrics } from '@/lib/mock-data/marketing-analytics'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'

export default function AnalyticsOverviewPage() {
    const [dateRange, setDateRange] = useState('30d')

    const leadStats = getLeadStats()
    const dealStats = getDealStats()
    const contactStats = getContactStats()
    const funnel = getConversionFunnel()
    const sequenceStats = getSequenceStats()
    const marketingMetrics = getOverallMetrics()

    const conversionRate = ((leadStats.converted / leadStats.total) * 100).toFixed(1)
    const avgDealSize = dealStats.total > 0 ? dealStats.wonValue / dealStats.wonDeals : 0
    const salesVelocity = (dealStats.active / (leadStats.total / 30)).toFixed(1)

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Analytics Overview"
                        description="Comprehensive view of sales, marketing, and engagement metrics"
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
                            Export Report
                        </Button>
                    </div>
                </div>
                <Separator />

                {/* Key Performance Indicators */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/crm/pipeline">
                        <MetricCard
                            title="Pipeline Value"
                            value={`$${(dealStats.pipelineValue / 1000).toFixed(0)}K`}
                            icon={DollarSign}
                            description={`${dealStats.active} active deals`}
                            trend={{ value: 8.4, isPositive: true }}
                        />
                    </Link>
                    <Link href="/crm/leads">
                        <MetricCard
                            title="Conversion Rate"
                            value={`${conversionRate}%`}
                            icon={Target}
                            description={`${leadStats.converted} converted leads`}
                            trend={{ value: 3.2, isPositive: true }}
                        />
                    </Link>
                    <MetricCard
                        title="Avg Deal Size"
                        value={`$${(avgDealSize / 1000).toFixed(0)}K`}
                        icon={TrendingUp}
                        description="Per won deal"
                        trend={{ value: 5.8, isPositive: true }}
                    />
                    <MetricCard
                        title="Sales Velocity"
                        value={`${salesVelocity} days`}
                        icon={Activity}
                        description="Avg time to close"
                    />
                </div>

                <Tabs defaultValue="sales" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
                        <TabsTrigger value="marketing">Marketing Analytics</TabsTrigger>
                        <TabsTrigger value="engagement">Engagement Analytics</TabsTrigger>
                        <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                    </TabsList>

                    {/* Sales Analytics Tab */}
                    <TabsContent value="sales" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Revenue Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Won Deals</span>
                                        <span className="text-sm font-semibold">${(dealStats.wonValue / 1000).toFixed(0)}K</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Lost Deals</span>
                                        <span className="text-sm font-semibold">${(dealStats.totalValue - dealStats.wonValue / 1000).toFixed(0)}K</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Total Pipeline</span>
                                        <span className="text-sm font-semibold">${(dealStats.pipelineValue / 1000).toFixed(0)}K</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Deal Stages</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {[
                                        { stage: 'Discovery', count: Math.floor(dealStats.active * 0.3), value: dealStats.pipelineValue * 0.3 },
                                        { stage: 'Proposal', count: Math.floor(dealStats.active * 0.4), value: dealStats.pipelineValue * 0.4 },
                                        { stage: 'Negotiation', count: Math.floor(dealStats.active * 0.3), value: dealStats.pipelineValue * 0.3 },
                                    ].map((item) => (
                                        <div key={item.stage} className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">{item.stage}</span>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-sm font-semibold">{item.count}</span>
                                                <span className="text-xs text-muted-foreground">(${(item.value / 1000).toFixed(0)}K)</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Win/Loss Ratio</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Won</span>
                                            <span className="text-sm font-semibold">{dealStats.wonDeals}</span>
                                        </div>
                                        <Progress value={(dealStats.wonDeals / (dealStats.wonDeals + dealStats.lostDeals)) * 100} className="h-2" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Lost</span>
                                            <span className="text-sm font-semibold">{dealStats.lostDeals}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Conversion Funnel */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Sales Funnel</CardTitle>
                                    <Link href="/crm/pipeline">
                                        <Button variant="ghost" size="sm">
                                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        { stage: 'Contacts', count: funnel.contacts, percentage: funnel.conversionRates.contactToLead },
                                        { stage: 'Leads', count: funnel.leads, percentage: funnel.conversionRates.leadToQualified },
                                        { stage: 'Qualified Leads', count: funnel.qualifiedLeads, percentage: funnel.conversionRates.qualifiedToDeal },
                                        { stage: 'Deals', count: funnel.deals, percentage: funnel.conversionRates.dealToCustomer },
                                        { stage: 'Customers', count: funnel.customers, percentage: funnel.conversionRates.dealToCustomer },
                                    ].map((stage) => (
                                        <div key={stage.stage} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{stage.stage}</span>
                                                <span className="font-medium">{stage.count} ({stage.percentage}%)</span>
                                            </div>
                                            <Progress value={stage.percentage} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Marketing Analytics Tab */}
                    <TabsContent value="marketing" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Social Reach</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{(marketingMetrics.reach / 1000).toFixed(0)}K</div>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +{marketingMetrics.reachGrowth}%
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{marketingMetrics.engagementRate}%</div>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +{marketingMetrics.engagementRateChange}%
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{(marketingMetrics.followers / 1000).toFixed(1)}K</div>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +{marketingMetrics.followerGrowth}%
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Best Platform</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold capitalize">{marketingMetrics.bestPlatform}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Highest engagement</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Marketing Performance</CardTitle>
                                    <Link href="/marketing/analytics">
                                        <Button variant="ghost" size="sm">
                                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Content Type</span>
                                        <span className="text-sm font-semibold">{marketingMetrics.topContentType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Avg Post Performance</span>
                                        <span className="text-sm font-semibold">{marketingMetrics.avgPostPerformance} engagements</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Engagement Analytics Tab */}
                    <TabsContent value="engagement" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Reply Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{sequenceStats.averageReplyRate}%</div>
                                    <p className="text-xs text-muted-foreground">{sequenceStats.totalReplies} replies</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Booking Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{sequenceStats.averageBookingRate}%</div>
                                    <p className="text-xs text-muted-foreground">{sequenceStats.totalBooked} meetings</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Active Sequences</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{sequenceStats.activeSequences}</div>
                                    <p className="text-xs text-muted-foreground">{sequenceStats.totalEnrolled} enrolled</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">68%</div>
                                    <p className="text-xs text-muted-foreground">Email opens</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Engagement Channels</CardTitle>
                                    <Link href="/crm/outreach/engagement">
                                        <Button variant="ghost" size="sm">
                                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 rounded-lg border">
                                        <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                        <div className="text-2xl font-bold">{sequenceStats.totalReplies}</div>
                                        <p className="text-xs text-muted-foreground">Emails</p>
                                    </div>
                                    <div className="text-center p-4 rounded-lg border">
                                        <Phone className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                        <div className="text-2xl font-bold">{sequenceStats.totalBooked}</div>
                                        <p className="text-xs text-muted-foreground">Calls</p>
                                    </div>
                                    <div className="text-center p-4 rounded-lg border">
                                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                        <div className="text-2xl font-bold">{sequenceStats.totalEnrolled}</div>
                                        <p className="text-xs text-muted-foreground">Messages</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Performance Metrics Tab */}
                    <TabsContent value="performance" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lead Status Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'New', value: leadStats.new, color: 'bg-blue-500' },
                                            { label: 'Contacted', value: leadStats.contacted, color: 'bg-yellow-500' },
                                            { label: 'Qualified', value: leadStats.qualified, color: 'bg-green-500' },
                                            { label: 'Converted', value: leadStats.converted, color: 'bg-purple-500' },
                                        ].map((item) => (
                                            <div key={item.label} className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{item.label}</span>
                                                    <span className="font-medium">{item.value}</span>
                                                </div>
                                                <Progress
                                                    value={(item.value / leadStats.total) * 100}
                                                    className="h-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Total Contacts</span>
                                            <span className="text-sm font-semibold">{contactStats.total}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Active Leads</span>
                                            <span className="text-sm font-semibold">{leadStats.total - leadStats.converted}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Converted Leads</span>
                                            <span className="text-sm font-semibold">{leadStats.converted}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Active Deals</span>
                                            <span className="text-sm font-semibold">{dealStats.active}</span>
                                        </div>
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
