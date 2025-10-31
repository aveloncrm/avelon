'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Save, ArrowLeft, Target, DollarSign, Eye, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'

export default function NewGoogleAdsCampaignPage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [campaignData, setCampaignData] = useState({
        // Basic Info
        name: '',
        objective: 'sales',
        description: '',

        // Budget
        budgetType: 'daily',
        dailyBudget: '',
        totalBudget: '',

        // Targeting
        location: 'all',
        ageRange: [18, 65],
        gender: 'all',
        interests: [] as string[],

        // Ad Creative
        headline: '',
        description1: '',
        description2: '',
        path1: '',
        path2: '',
        finalUrl: '',

        // Advanced
        adSchedule: 'all_days',
        deviceTargeting: 'all',
        bidStrategy: 'maximize_conversions'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: "Campaign created!",
                description: "Your Google Ads campaign has been created successfully.",
            })

            router.push('/marketing/paid-ads')
        } catch {
            toast({
                title: "Error",
                description: "Failed to create campaign. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <Heading
                            title="Create Google Ads Campaign"
                            description="Build a new search and display campaign"
                        />
                    </div>
                </div>
                <Separator />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="basic" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="basic">Campaign Info</TabsTrigger>
                            <TabsTrigger value="budget">Budget</TabsTrigger>
                            <TabsTrigger value="targeting">Targeting</TabsTrigger>
                            <TabsTrigger value="creative">Ad Creative</TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>

                        {/* Campaign Info */}
                        <TabsContent value="basic" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Campaign Details</CardTitle>
                                    <CardDescription>Basic information about your campaign</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Campaign Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            placeholder="Summer Sale - Product Campaign"
                                            value={campaignData.name}
                                            onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="objective">Campaign Objective <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={campaignData.objective}
                                            onValueChange={(value) => setCampaignData({ ...campaignData, objective: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sales">Sales</SelectItem>
                                                <SelectItem value="leads">Leads</SelectItem>
                                                <SelectItem value="website_traffic">Website Traffic</SelectItem>
                                                <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Brief description of your campaign goals..."
                                            value={campaignData.description}
                                            onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Campaign Type
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={campaignData.objective} onValueChange={(value) => setCampaignData({ ...campaignData, objective: value })}>
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                            <RadioGroupItem value="search" id="search" />
                                            <Label htmlFor="search" className="flex-1 cursor-pointer">
                                                <div className="font-medium">Search Campaign</div>
                                                <div className="text-sm text-muted-foreground">Show ads on Google search results</div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                            <RadioGroupItem value="display" id="display" />
                                            <Label htmlFor="display" className="flex-1 cursor-pointer">
                                                <div className="font-medium">Display Campaign</div>
                                                <div className="text-sm text-muted-foreground">Show ads on websites and apps</div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                            <RadioGroupItem value="shopping" id="shopping" />
                                            <Label htmlFor="shopping" className="flex-1 cursor-pointer">
                                                <div className="font-medium">Shopping Campaign</div>
                                                <div className="text-sm text-muted-foreground">Promote your products on Google Shopping</div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Budget */}
                        <TabsContent value="budget" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Budget Settings
                                    </CardTitle>
                                    <CardDescription>Set your campaign budget and bidding strategy</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Budget Type</Label>
                                        <RadioGroup
                                            value={campaignData.budgetType}
                                            onValueChange={(value) => setCampaignData({ ...campaignData, budgetType: value })}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="daily" id="daily" />
                                                <Label htmlFor="daily" className="cursor-pointer">Daily Budget</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="total" id="total" />
                                                <Label htmlFor="total" className="cursor-pointer">Total Budget</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {campaignData.budgetType === 'daily' ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="dailyBudget">
                                                Daily Budget ($) <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="dailyBudget"
                                                type="number"
                                                placeholder="50"
                                                value={campaignData.dailyBudget}
                                                onChange={(e) => setCampaignData({ ...campaignData, dailyBudget: e.target.value })}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Recommended: $10-$100 per day
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label htmlFor="totalBudget">
                                                Total Budget ($) <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="totalBudget"
                                                type="number"
                                                placeholder="500"
                                                value={campaignData.totalBudget}
                                                onChange={(e) => setCampaignData({ ...campaignData, totalBudget: e.target.value })}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Your campaign will stop when this budget is reached
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="bidStrategy">Bidding Strategy</Label>
                                        <Select
                                            value={campaignData.bidStrategy}
                                            onValueChange={(value) => setCampaignData({ ...campaignData, bidStrategy: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="maximize_conversions">Maximize Conversions</SelectItem>
                                                <SelectItem value="target_cpa">Target CPA</SelectItem>
                                                <SelectItem value="maximize_roas">Maximize ROAS</SelectItem>
                                                <SelectItem value="manual_cpc">Manual CPC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Targeting */}
                        <TabsContent value="targeting" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Audience Targeting
                                    </CardTitle>
                                    <CardDescription>Define who sees your ads</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Locations</Label>
                                        <Select
                                            value={campaignData.location}
                                            onValueChange={(value) => setCampaignData({ ...campaignData, location: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Countries</SelectItem>
                                                <SelectItem value="us">United States</SelectItem>
                                                <SelectItem value="uk">United Kingdom</SelectItem>
                                                <SelectItem value="ca">Canada</SelectItem>
                                                <SelectItem value="au">Australia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Age Range</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min="18"
                                                max="65"
                                                value={campaignData.ageRange[0]}
                                                onChange={(e) => setCampaignData({
                                                    ...campaignData,
                                                    ageRange: [parseInt(e.target.value), campaignData.ageRange[1]]
                                                })}
                                            />
                                            <span>to</span>
                                            <Input
                                                type="number"
                                                min="18"
                                                max="65"
                                                value={campaignData.ageRange[1]}
                                                onChange={(e) => setCampaignData({
                                                    ...campaignData,
                                                    ageRange: [campaignData.ageRange[0], parseInt(e.target.value)]
                                                })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Gender</Label>
                                        <RadioGroup
                                            value={campaignData.gender}
                                            onValueChange={(value) => setCampaignData({ ...campaignData, gender: value })}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="all" id="all-gender" />
                                                <Label htmlFor="all-gender" className="cursor-pointer">All</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="male" id="male" />
                                                <Label htmlFor="male" className="cursor-pointer">Male</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="female" id="female" />
                                                <Label htmlFor="female" className="cursor-pointer">Female</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Ad Creative */}
                        <TabsContent value="creative" className="space-y-4">
                            <Alert>
                                <AlertDescription>
                                    These will be the actual ad content shown to users
                                </AlertDescription>
                            </Alert>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        Ad Content
                                    </CardTitle>
                                    <CardDescription>Write compelling ad copy</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="headline">Headline (30 characters)</Label>
                                        <Input
                                            id="headline"
                                            placeholder="Shop Our Best Deals"
                                            maxLength={30}
                                            value={campaignData.headline}
                                            onChange={(e) => setCampaignData({ ...campaignData, headline: e.target.value })}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {campaignData.headline.length} / 30 characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description1">Description 1 (90 characters)</Label>
                                        <Textarea
                                            id="description1"
                                            placeholder="Discover amazing products at unbeatable prices. Free shipping on orders over $50."
                                            maxLength={90}
                                            value={campaignData.description1}
                                            onChange={(e) => setCampaignData({ ...campaignData, description1: e.target.value })}
                                            rows={2}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {campaignData.description1.length} / 90 characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description2">Description 2 (90 characters)</Label>
                                        <Textarea
                                            id="description2"
                                            placeholder="Limited time offer. Shop now and save big!"
                                            maxLength={90}
                                            value={campaignData.description2}
                                            onChange={(e) => setCampaignData({ ...campaignData, description2: e.target.value })}
                                            rows={2}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {campaignData.description2.length} / 90 characters
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="path1">Path 1 (15 characters)</Label>
                                            <Input
                                                id="path1"
                                                placeholder="products"
                                                maxLength={15}
                                                value={campaignData.path1}
                                                onChange={(e) => setCampaignData({ ...campaignData, path1: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="path2">Path 2 (15 characters)</Label>
                                            <Input
                                                id="path2"
                                                placeholder="sale"
                                                maxLength={15}
                                                value={campaignData.path2}
                                                onChange={(e) => setCampaignData({ ...campaignData, path2: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="finalUrl">Final URL <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="finalUrl"
                                            type="url"
                                            placeholder="https://yoursite.com/products"
                                            value={campaignData.finalUrl}
                                            onChange={(e) => setCampaignData({ ...campaignData, finalUrl: e.target.value })}
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Advanced */}
                        <TabsContent value="advanced" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Advanced Settings</CardTitle>
                                    <CardDescription>Fine-tune your campaign</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="deviceTargeting">Device Targeting</Label>
                                        <Select
                                            value={campaignData.deviceTargeting}
                                            onValueChange={(value) => setCampaignData({ ...campaignData, deviceTargeting: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Devices</SelectItem>
                                                <SelectItem value="desktop">Desktop Only</SelectItem>
                                                <SelectItem value="mobile">Mobile Only</SelectItem>
                                                <SelectItem value="tablet">Tablet Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="adSchedule">Ad Schedule</Label>
                                        <Select
                                            value={campaignData.adSchedule}
                                            onValueChange={(value) => setCampaignData({ ...campaignData, adSchedule: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all_days">All Days, All Hours</SelectItem>
                                                <SelectItem value="weekdays">Weekdays Only</SelectItem>
                                                <SelectItem value="weekends">Weekends Only</SelectItem>
                                                <SelectItem value="business_hours">Business Hours (9 AM - 5 PM)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Submit */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" />
                            Create Campaign
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

