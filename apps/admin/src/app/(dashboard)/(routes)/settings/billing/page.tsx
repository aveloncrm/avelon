'use client'

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Download, Plus, Check, X } from 'lucide-react'

const mockInvoices = [
    {
        id: 'INV-2024-001',
        date: '2024-03-01',
        amount: '$99.00',
        status: 'paid',
        description: 'Professional Plan - March 2024',
    },
    {
        id: 'INV-2024-002',
        date: '2024-02-01',
        amount: '$99.00',
        status: 'paid',
        description: 'Professional Plan - February 2024',
    },
    {
        id: 'INV-2024-003',
        date: '2024-01-01',
        amount: '$99.00',
        status: 'paid',
        description: 'Professional Plan - January 2024',
    },
]

export default function BillingSettingsPage() {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading
                    title="Billing & Subscription"
                    description="Manage your subscription and billing information"
                />
                <Separator />

                {/* Current Plan */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Current Plan</CardTitle>
                                <CardDescription>You are currently on the Professional plan</CardDescription>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Plan</p>
                                <p className="text-2xl font-bold">Professional</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Price</p>
                                <p className="text-2xl font-bold">$99</p>
                                <p className="text-sm text-muted-foreground">per month</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                                <p className="text-2xl font-bold">April 1, 2024</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <Button>Upgrade Plan</Button>
                            <Button variant="outline">Cancel Subscription</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Payment Method</CardTitle>
                                <CardDescription>Manage your payment methods</CardDescription>
                            </div>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Payment Method
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-medium">•••• •••• •••• 4242</p>
                                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">Default</Badge>
                                <Button variant="ghost" size="sm">
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Billing History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Billing History</CardTitle>
                        <CardDescription>View and download your past invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockInvoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Download className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{invoice.id}</p>
                                            <p className="text-sm text-muted-foreground">{invoice.description}</p>
                                            <p className="text-xs text-muted-foreground">{invoice.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold">{invoice.amount}</p>
                                        {invoice.status === 'paid' ? (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                <Check className="mr-1 h-3 w-3" />
                                                Paid
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                                                <X className="mr-1 h-3 w-3" />
                                                Unpaid
                                            </Badge>
                                        )}
                                        <Button variant="ghost" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle>Available Plans</CardTitle>
                        <CardDescription>Compare our plans and upgrade as needed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Starter</CardTitle>
                                    <div className="text-3xl font-bold">$29</div>
                                    <p className="text-sm text-muted-foreground">per month</p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="font-medium">Perfect for small teams</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>5 team members</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>50GB storage</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>Basic support</span>
                                        </li>
                                    </ul>
                                    <Button className="w-full" variant="outline">
                                        Get Started
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-primary">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Professional</CardTitle>
                                        <Badge>Current</Badge>
                                    </div>
                                    <div className="text-3xl font-bold">$99</div>
                                    <p className="text-sm text-muted-foreground">per month</p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="font-medium">Best for growing businesses</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>Unlimited team members</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>500GB storage</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>Priority support</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>Advanced features</span>
                                        </li>
                                    </ul>
                                    <Button className="w-full">Current Plan</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Enterprise</CardTitle>
                                    <div className="text-3xl font-bold">Custom</div>
                                    <p className="text-sm text-muted-foreground">Contact sales</p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="font-medium">For large organizations</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>Unlimited everything</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>Dedicated support</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>Custom integrations</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>SLA guarantee</span>
                                        </li>
                                    </ul>
                                    <Button className="w-full" variant="outline">
                                        Contact Sales
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
