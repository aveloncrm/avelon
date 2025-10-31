'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    DollarSign,
    TrendingUp,
    TrendingDown,

    Target,

    Download,

    BarChart3,


    Award,
    ArrowRight
} from 'lucide-react'
import { getDealStats } from '@/lib/mock-data/crm-unified'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export default function SalesReportsPage() {
    const [dateRange, setDateRange] = useState('30d')
    const [reportType, setReportType] = useState('overview')

    const dealStats = getDealStats()
    // const leadStats = getLeadStats()

    // Mock data for detailed reports
    const monthlyRevenue = [
        { month: 'Jan', revenue: 45000, deals: 12 },
        { month: 'Feb', revenue: 52000, deals: 15 },
        { month: 'Mar', revenue: 48000, deals: 13 },
        { month: 'Apr', revenue: 61000, deals: 18 },
        { month: 'May', revenue: 55000, deals: 16 },
        { month: 'Jun', revenue: 68000, deals: 20 },
    ]

    const topProducts = [
        { name: 'Enterprise Package', revenue: 125000, deals: 8, growth: 12.5 },
        { name: 'Business Pro', revenue: 98000, deals: 14, growth: 8.3 },
        { name: 'Starter Plan', revenue: 65000, deals: 25, growth: 15.2 },
        { name: 'Add-on Services', revenue: 42000, deals: 18, growth: 5.8 },
    ]

    const dealStages = [
        { stage: 'Discovery', count: 45, value: 125000, percentage: 100 },
        { stage: 'Proposal', count: 32, value: 95000, percentage: 71 },
        { stage: 'Negotiation', count: 18, value: 68000, percentage: 40 },
        { stage: 'Decision', count: 12, value: 45000, percentage: 27 },
        { stage: 'Won', count: 28, value: 180000, percentage: 62 },
    ]

    const topPerformers = [
        { name: 'John Smith', deals: 14, revenue: 165000, quota: 150000, achievement: 110 },
        { name: 'Sarah Johnson', deals: 12, revenue: 142000, quota: 150000, achievement: 95 },
        { name: 'Mike Chen', deals: 10, revenue: 128000, quota: 150000, achievement: 85 },
        { name: 'Emily Davis', deals: 9, revenue: 112000, quota: 150000, achievement: 75 },
    ]

    const winLossReasons = [
        { reason: 'Price too high', count: 8, percentage: 32 },
        { reason: 'Competitor chosen', count: 6, percentage: 24 },
        { reason: 'Budget constraints', count: 5, percentage: 20 },
        { reason: 'No decision made', count: 4, percentage: 16 },
        { reason: 'Other', count: 2, percentage: 8 },
    ]

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Sales Reports"
                        description="Comprehensive sales performance analysis and insights"
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
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${(dealStats.wonValue / 1000).toFixed(0)}K</div>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +12.5% from last period
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dealStats.wonDeals}</div>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{dealStats.wonDeals - 8} from last period
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {((dealStats.wonDeals / (dealStats.wonDeals + dealStats.lostDeals)) * 100).toFixed(0)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Based on closed deals</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${((dealStats.wonValue / dealStats.wonDeals) / 1000).toFixed(0)}K
                            </div>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +5.8% from last period
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
                        <TabsTrigger value="deals">Deal Performance</TabsTrigger>
                        <TabsTrigger value="team">Team Performance</TabsTrigger>
                        <TabsTrigger value="products">Product Analysis</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Revenue Trend</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {monthlyRevenue.map((month) => (
                                            <div key={month.month} className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{month.month}</span>
                                                    <div className="flex gap-4">
                                                        <span className="font-medium">${(month.revenue / 1000).toFixed(0)}K</span>
                                                        <span className="text-muted-foreground">{month.deals} deals</span>
                                                    </div>
                                                </div>
                                                <Progress
                                                    value={(month.revenue / monthlyRevenue[monthlyRevenue.length - 1].revenue) * 100}
                                                    className="h-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Sales Funnel</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {dealStages.map((stage) => (
                                            <div key={stage.stage} className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{stage.stage}</span>
                                                    <span className="font-medium">{stage.count} deals</span>
                                                </div>
                                                <Progress value={stage.percentage} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Top Performing Products</CardTitle>
                                    <Link href="/products">
                                        <Button variant="ghost" size="sm">
                                            View All <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {topProducts.map((product) => (
                                        <div key={product.name} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div className="flex-1">
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-sm text-muted-foreground">{product.deals} deals</div>
                                            </div>
                                            <div className="text-right mr-4">
                                                <div className="font-semibold">${(product.revenue / 1000).toFixed(0)}K</div>
                                                <div className="text-xs text-green-600">
                                                    <TrendingUp className="inline h-3 w-3 mr-1" />
                                                    +{product.growth}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Revenue Analysis Tab */}
                    <TabsContent value="revenue" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">${(dealStats.wonValue / 1000).toFixed(0)}K</div>
                                    <p className="text-sm text-green-600 mt-2">
                                        <TrendingUp className="inline h-4 w-4 mr-1" />
                                        +12.5% growth
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Lost Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">${(dealStats.lostValue / 1000).toFixed(0)}K</div>
                                    <p className="text-sm text-red-600 mt-2">
                                        <TrendingDown className="inline h-4 w-4 mr-1" />
                                        {dealStats.lostDeals} lost deals
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Revenue at Risk</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">${(dealStats.pipelineValue / 1000).toFixed(0)}K</div>
                                    <p className="text-sm text-muted-foreground mt-2">{dealStats.active} open deals</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue by Month</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-6 gap-4">
                                    {monthlyRevenue.map((month) => (
                                        <div key={month.month} className="text-center">
                                            <div className="text-sm text-muted-foreground mb-2">{month.month}</div>
                                            <div className="text-2xl font-bold mb-1">${(month.revenue / 1000).toFixed(0)}</div>
                                            <div className="text-xs text-muted-foreground">{month.deals} deals</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Win/Loss Reasons</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {winLossReasons.map((item) => (
                                        <div key={item.reason} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{item.reason}</span>
                                                <span className="font-medium">{item.count} deals ({item.percentage}%)</span>
                                            </div>
                                            <Progress value={item.percentage} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Deal Performance Tab */}
                    <TabsContent value="deals" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Deal Stage Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                                    {dealStages.map((stage) => (
                                        <div key={stage.stage} className="text-center p-4 rounded-lg border">
                                            <div className="text-sm text-muted-foreground mb-2">{stage.stage}</div>
                                            <div className="text-3xl font-bold mb-1">{stage.count}</div>
                                            <div className="text-xs text-muted-foreground">${(stage.value / 1000).toFixed(0)}K value</div>
                                            <div className="mt-3">
                                                <Progress value={stage.percentage} className="h-2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Deal Velocity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                                        <span className="font-medium">Average Days to Close</span>
                                        <span className="text-2xl font-bold">45 days</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="text-center p-3 rounded-lg border">
                                            <div className="text-sm text-muted-foreground mb-1">Fastest</div>
                                            <div className="text-xl font-bold">18 days</div>
                                        </div>
                                        <div className="text-center p-3 rounded-lg border">
                                            <div className="text-sm text-muted-foreground mb-1">Median</div>
                                            <div className="text-xl font-bold">42 days</div>
                                        </div>
                                        <div className="text-center p-3 rounded-lg border">
                                            <div className="text-sm text-muted-foreground mb-1">Longest</div>
                                            <div className="text-xl font-bold">92 days</div>
                                        </div>
                                        <div className="text-center p-3 rounded-lg border">
                                            <div className="text-sm text-muted-foreground mb-1">In Progress</div>
                                            <div className="text-xl font-bold">{dealStats.active}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Team Performance Tab */}
                    <TabsContent value="team" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topPerformers.map((person, index) => (
                                        <div key={person.name} className="flex items-center justify-between p-4 rounded-lg border">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{person.name}</div>
                                                    <div className="text-sm text-muted-foreground">{person.deals} deals closed</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">${(person.revenue / 1000).toFixed(0)}K</div>
                                                <div className="text-sm text-muted-foreground">
                                                    <Badge variant={person.achievement >= 100 ? 'default' : 'secondary'}>
                                                        {person.achievement}% of quota
                                                    </Badge>
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
                                    <CardTitle className="text-sm font-medium">Team Quota</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$600K</div>
                                    <p className="text-sm text-muted-foreground mt-2">Total team target</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Team Achievement</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {((dealStats.wonValue / 600000) * 100).toFixed(0)}%
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">Of target achieved</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Over/Under</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ${((dealStats.wonValue - 600000) / 1000).toFixed(0)}K
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">vs target</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Product Analysis Tab */}
                    <TabsContent value="products" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {topProducts.map((product) => (
                                        <div key={product.name} className="space-y-2 p-4 rounded-lg border">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-sm text-muted-foreground">{product.deals} deals</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">${(product.revenue / 1000).toFixed(0)}K</div>
                                                    <div className="text-xs text-green-600">
                                                        <TrendingUp className="inline h-3 w-3 mr-1" />
                                                        +{product.growth}%
                                                    </div>
                                                </div>
                                            </div>
                                            <Progress
                                                value={(product.revenue / topProducts[0].revenue) * 100}
                                                className="h-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
