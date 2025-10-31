'use client'

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Users, Database, Mail, Image, TrendingUp, AlertCircle } from 'lucide-react'

const mockUsage = [
    {
        name: 'Team Members',
        used: 3,
        limit: 10,
        unit: 'users',
        icon: Users,
        color: 'text-blue-500',
    },
    {
        name: 'Storage',
        used: 25,
        limit: 100,
        unit: 'GB',
        icon: Database,
        color: 'text-green-500',
    },
    {
        name: 'Emails per Month',
        used: 4500,
        limit: 10000,
        unit: 'emails',
        icon: Mail,
        color: 'text-purple-500',
    },
    {
        name: 'API Calls',
        used: 12500,
        limit: 50000,
        unit: 'calls',
        icon: TrendingUp,
        color: 'text-orange-500',
    },
    {
        name: 'Uploads',
        used: 180,
        limit: 500,
        unit: 'files',
        icon: Image,
        color: 'text-pink-500',
    },
]

export default function LimitsSettingsPage() {
    const getPercentage = (used: number, limit: number) => {
        return (used / limit) * 100
    }

    const getStatusColor = (percentage: number) => {
        if (percentage >= 90) return 'text-red-500'
        if (percentage >= 75) return 'text-orange-500'
        return 'text-green-500'
    }

    // const getProgressColor = (percentage: number) => {
    //     if (percentage >= 90) return 'bg-red-500'
    //     if (percentage >= 75) return 'bg-orange-500'
    //     return 'bg-green-500'
    // }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading
                    title="Usage & Limits"
                    description="Monitor your usage and subscription limits"
                />
                <Separator />

                {/* Usage Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Plan Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Professional</div>
                            <p className="text-xs text-muted-foreground">Billed monthly</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Renewal Date</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">April 1</div>
                            <p className="text-xs text-muted-foreground">Next billing cycle</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Overall Usage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45%</div>
                            <p className="text-xs text-muted-foreground">Average across limits</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Usage Details */}
                <div className="space-y-4">
                    {mockUsage.map((usage) => {
                        const percentage = getPercentage(usage.used, usage.limit)
                        const Icon = usage.icon
                        return (
                            <Card key={usage.name}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${usage.color}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{usage.name}</CardTitle>
                                                <CardDescription>
                                                    {usage.used.toLocaleString()} of {usage.limit.toLocaleString()} {usage.unit}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${getStatusColor(percentage)}`}>
                                                {percentage.toFixed(0)}%
                                            </div>
                                            {percentage >= 90 && (
                                                <Badge variant="destructive" className="mt-1">
                                                    <AlertCircle className="mr-1 h-3 w-3" />
                                                    Near Limit
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Progress value={percentage} className="h-2" />
                                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                        <span>{usage.used.toLocaleString()} used</span>
                                        <span>{usage.limit.toLocaleString()} limit</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Limit Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Understanding Your Limits</CardTitle>
                        <CardDescription>
                            Learn more about how your usage limits work
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div className="flex gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    ?
                                </div>
                                <div>
                                    <p className="font-medium">When do limits reset?</p>
                                    <p className="text-muted-foreground">
                                        Most limits reset on your billing cycle date (1st of each month). Some limits may reset daily or weekly.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    ?
                                </div>
                                <div>
                                    <p className="font-medium">What happens when I reach a limit?</p>
                                    <p className="text-muted-foreground">
                                        You'll receive notifications when you reach 75%, 90%, and 100% of your limit. At 100%, the feature will be unavailable until the limit resets or you upgrade.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    ?
                                </div>
                                <div>
                                    <p className="font-medium">How can I increase my limits?</p>
                                    <p className="text-muted-foreground">
                                        Upgrade to a higher plan or contact our sales team for custom enterprise solutions with higher limits.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
