'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Check, Loader2, Sparkles } from 'lucide-react'
import api from '@/lib/api'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PLANS = {
    free: {
        name: 'Free',
        price: 0,
        features: [
            '1 Store',
            '50 Products',
            '100 Orders/month',
            'Basic Analytics',
            'Email Support',
        ],
    },
    starter: {
        name: 'Starter',
        price: 29,
        features: [
            '3 Stores',
            '500 Products',
            '1,000 Orders/month',
            'Advanced Analytics',
            'Custom Domain',
            'Email Support',
        ],
    },
    pro: {
        name: 'Pro',
        price: 99,
        features: [
            '10 Stores',
            'Unlimited Products',
            'Unlimited Orders',
            'Advanced Analytics + Reports',
            'Custom Domain',
            'White-label Branding',
            'Priority Support',
            'API Access',
        ],
        recommended: true,
    },
    enterprise: {
        name: 'Enterprise',
        price: null,
        features: [
            'Unlimited Stores',
            'Unlimited Everything',
            'Custom Analytics',
            'Full White-label',
            'Dedicated Support',
            'Custom Integrations',
            'SLA Guarantee',
        ],
    },
}

interface Subscription {
    id: string
    plan: 'free' | 'starter' | 'pro' | 'enterprise'
    status: string
    currentPeriodEnd?: string
}

export default function BillingPage() {
    const router = useRouter()
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [loading, setLoading] = useState(true)
    const [upgrading, setUpgrading] = useState<string | null>(null)

    useEffect(() => {
        loadSubscription()
    }, [])

    async function loadSubscription() {
        try {
            const data = await api.get('/api/billing/subscription')
            setSubscription(data)
        } catch (error) {
            console.error('Failed to load subscription:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpgrade(plan: 'starter' | 'pro') {
        try {
            setUpgrading(plan)
            const response = await api.post('/api/billing/checkout', { plan })

            if (response.url) {
                window.location.href = response.url
            }
        } catch (error) {
            console.error('Failed to create checkout:', error)
            setUpgrading(null)
        }
    }

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        )
    }

    const currentPlan = subscription?.plan || 'free'

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading
                    title="Billing & Plans"
                    description="Manage your subscription and billing"
                />
            </div>
            <Separator />

            {subscription && subscription.status !== 'active' && (
                <Card className="border-destructive bg-destructive/10">
                    <CardHeader>
                        <CardTitle>Payment Issue</CardTitle>
                        <CardDescription>
                            Your subscription payment failed. Please update your payment method.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(PLANS).map(([key, plan]) => {
                    const isCurrent = currentPlan === key
                    const canUpgrade = key !== 'free' && key !== 'enterprise' && !isCurrent
                    const isRecommended = 'recommended' in plan && plan.recommended

                    return (
                        <Card
                            key={key}
                            className={`relative ${isCurrent ? 'border-primary shadow-lg' : ''
                                } ${isRecommended ? 'border-2 border-primary' : ''}`}
                        >
                            {isRecommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        Recommended
                                    </Badge>
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{plan.name}</CardTitle>
                                    {isCurrent && (
                                        <Badge variant="outline">Current</Badge>
                                    )}
                                </div>
                                <CardDescription>
                                    {plan.price === null ? (
                                        <span className="text-2xl font-bold">Custom</span>
                                    ) : (
                                        <div>
                                            <span className="text-3xl font-bold">
                                                ${plan.price}
                                            </span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <Check className="h-4 w-4 mt-0.5 text-primary" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                {isCurrent ? (
                                    <Button variant="outline" className="w-full" disabled>
                                        Current Plan
                                    </Button>
                                ) : key === 'enterprise' ? (
                                    <Button
                                        variant="default"
                                        className="w-full"
                                        onClick={() => window.location.href = 'mailto:sales@avelon.com'}
                                    >
                                        Contact Sales
                                    </Button>
                                ) : canUpgrade ? (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleUpgrade(key as 'starter' | 'pro')}
                                        disabled={upgrading !== null}
                                    >
                                        {upgrading === key ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Upgrading...
                                            </>
                                        ) : (
                                            'Upgrade'
                                        )}
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="w-full" disabled>
                                        Not Available
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {subscription && subscription.currentPeriodEnd && (
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                                    {subscription.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Renews on</span>
                                <span className="text-sm font-medium">
                                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
