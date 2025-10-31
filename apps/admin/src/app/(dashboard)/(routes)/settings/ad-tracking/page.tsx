'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Save,
    CheckCircle2,
    AlertCircle,
    Info,
    ExternalLink,
    Copy,
    Loader2
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

interface AdTrackingConfig {
    // Google Ads
    googleAds: {
        enabled: boolean
        conversionId: string
        conversionLabel: string
        description: string
    }
    // Meta Ads
    metaAds: {
        enabled: boolean
        pixelId: string
        accessToken: string
        description: string
    }
    // Google Analytics
    googleAnalytics: {
        enabled: boolean
        measurementId: string
        description: string
    }
}

export default function AdTrackingSettingsPage() {
    const { toast: showToast } = useToast()
    const [isSaving, setIsSaving] = useState(false)
    const [config, setConfig] = useState<AdTrackingConfig>({
        googleAds: {
            enabled: false,
            conversionId: '',
            conversionLabel: '',
            description: ''
        },
        metaAds: {
            enabled: false,
            pixelId: '',
            accessToken: '',
            description: ''
        },
        googleAnalytics: {
            enabled: false,
            measurementId: '',
            description: ''
        }
    })

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            showToast({
                title: "Settings saved",
                description: "Your ad tracking configuration has been updated successfully.",
            })
        } catch {
            showToast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        showToast({
            title: "Copied!",
            description: "Configuration details copied to clipboard.",
        })
    }

    const updateConfig = (section: keyof AdTrackingConfig, field: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    const hasRequiredFields = () => {
        return (
            config.googleAds.enabled
                ? (config.googleAds.conversionId && config.googleAds.conversionLabel)
                : true
        ) && (
                config.metaAds.enabled
                    ? config.metaAds.pixelId
                    : true
            ) && (
                config.googleAnalytics.enabled
                    ? config.googleAnalytics.measurementId
                    : true
            )
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Heading
                            title="Ad Tracking Settings"
                            description="Configure Meta Ads and Google Ads integration for conversion tracking"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            Track conversions and optimize your ad campaigns with detailed analytics
                        </p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !hasRequiredFields()}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Settings
                            </>
                        )}
                    </Button>
                </div>
                <Separator />

                {/* Info Alert */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Add your tracking IDs from Meta Ads Manager and Google Ads to enable conversion tracking on your storefront.
                        These settings will be automatically applied to your e-commerce site.
                    </AlertDescription>
                </Alert>

                {/* Platform Status Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Google Ads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                {config.googleAds.enabled && config.googleAds.conversionId ? (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">Connected</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-muted-foreground">Not Configured</span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Meta Ads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                {config.metaAds.enabled && config.metaAds.pixelId ? (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">Connected</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-muted-foreground">Not Configured</span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Google Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                {config.googleAnalytics.enabled && config.googleAnalytics.measurementId ? (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">Connected</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-muted-foreground">Not Configured</span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Configuration Tabs */}
                <Tabs defaultValue="google-ads" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="google-ads">Google Ads</TabsTrigger>
                        <TabsTrigger value="meta-ads">Meta Ads</TabsTrigger>
                        <TabsTrigger value="analytics">Google Analytics</TabsTrigger>
                    </TabsList>

                    {/* Google Ads Configuration */}
                    <TabsContent value="google-ads" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Google Ads Conversion Tracking</CardTitle>
                                        <CardDescription>
                                            Track conversions from your Google Ads campaigns
                                        </CardDescription>
                                    </div>
                                    <Switch
                                        checked={config.googleAds.enabled}
                                        onCheckedChange={(checked) => updateConfig('googleAds', 'enabled', checked)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription className="text-xs">
                                        Find your Conversion ID in Google Ads: <span className="font-mono">Tools & Settings → Measurements → Conversions</span>
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="google-conversion-id">
                                            Conversion ID (AW-XXXXXXXXXX)
                                            <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="google-conversion-id"
                                                placeholder="AW-123456789"
                                                value={config.googleAds.conversionId}
                                                onChange={(e) => updateConfig('googleAds', 'conversionId', e.target.value)}
                                                disabled={!config.googleAds.enabled}
                                                className="font-mono"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard('NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID')}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Your Google Ads Conversion Tracking ID
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="google-conversion-label">
                                            Conversion Label
                                            <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="google-conversion-label"
                                                placeholder="AbC123xYz456"
                                                value={config.googleAds.conversionLabel}
                                                onChange={(e) => updateConfig('googleAds', 'conversionLabel', e.target.value)}
                                                disabled={!config.googleAds.enabled}
                                                className="font-mono"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard('NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL')}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Unique label for this conversion action
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="google-ads-description">Description</Label>
                                        <Textarea
                                            id="google-ads-description"
                                            placeholder="E-commerce purchase conversion tracking"
                                            value={config.googleAds.description}
                                            onChange={(e) => updateConfig('googleAds', 'description', e.target.value)}
                                            disabled={!config.googleAds.enabled}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open('https://ads.google.com/', '_blank')}
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Open Google Ads
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Meta Ads Configuration */}
                    <TabsContent value="meta-ads" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Meta (Facebook) Pixel</CardTitle>
                                        <CardDescription>
                                            Track visitor actions and optimize Meta ad campaigns
                                        </CardDescription>
                                    </div>
                                    <Switch
                                        checked={config.metaAds.enabled}
                                        onCheckedChange={(checked) => updateConfig('metaAds', 'enabled', checked)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription className="text-xs">
                                        Find your Pixel ID in Meta Events Manager: <span className="font-mono">Business Settings → Data Sources → Pixels</span>
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="meta-pixel-id">
                                            Pixel ID
                                            <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="meta-pixel-id"
                                                placeholder="1234567890123456"
                                                value={config.metaAds.pixelId}
                                                onChange={(e) => updateConfig('metaAds', 'pixelId', e.target.value)}
                                                disabled={!config.metaAds.enabled}
                                                className="font-mono"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard('NEXT_PUBLIC_META_PIXEL_ID')}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            15-16 digit Facebook Pixel ID
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meta-access-token">
                                            Access Token (Optional - for Conversions API)
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="meta-access-token"
                                                type="password"
                                                placeholder="Enter access token for server-side tracking"
                                                value={config.metaAds.accessToken}
                                                onChange={(e) => updateConfig('metaAds', 'accessToken', e.target.value)}
                                                disabled={!config.metaAds.enabled}
                                                className="font-mono"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard('META_ACCESS_TOKEN')}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            For enhanced server-to-server tracking (recommended)
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meta-ads-description">Description</Label>
                                        <Textarea
                                            id="meta-ads-description"
                                            placeholder="E-commerce site tracking for Meta ad optimization"
                                            value={config.metaAds.description}
                                            onChange={(e) => updateConfig('metaAds', 'description', e.target.value)}
                                            disabled={!config.metaAds.enabled}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open('https://business.facebook.com/events_manager', '_blank')}
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Open Meta Events Manager
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Google Analytics Configuration */}
                    <TabsContent value="analytics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Google Analytics 4</CardTitle>
                                        <CardDescription>
                                            Track website visitors and user behavior
                                        </CardDescription>
                                    </div>
                                    <Switch
                                        checked={config.googleAnalytics.enabled}
                                        onCheckedChange={(checked) => updateConfig('googleAnalytics', 'enabled', checked)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription className="text-xs">
                                        Find your Measurement ID in Google Analytics: <span className="font-mono">Admin → Property → Data Streams</span>
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ga-measurement-id">
                                            Measurement ID (G-XXXXXXXXXX)
                                            <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="ga-measurement-id"
                                                placeholder="G-ABCDEFGHIJ"
                                                value={config.googleAnalytics.measurementId}
                                                onChange={(e) => updateConfig('googleAnalytics', 'measurementId', e.target.value)}
                                                disabled={!config.googleAnalytics.enabled}
                                                className="font-mono"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID')}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Your Google Analytics 4 Measurement ID
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ga-description">Description</Label>
                                        <Textarea
                                            id="ga-description"
                                            placeholder="Website analytics and user behavior tracking"
                                            value={config.googleAnalytics.description}
                                            onChange={(e) => updateConfig('googleAnalytics', 'description', e.target.value)}
                                            disabled={!config.googleAnalytics.enabled}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open('https://analytics.google.com/', '_blank')}
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Open Google Analytics
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Environment Variables Reference */}
                <Card>
                    <CardHeader>
                        <CardTitle>Environment Variables</CardTitle>
                        <CardDescription>
                            These will be automatically added to your .env.local file
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 font-mono text-sm">
                            {config.googleAds.enabled && (
                                <>
                                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                        <span className="text-green-600">NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID</span>
                                        <span className="text-muted-foreground">=</span>
                                        <span>{config.googleAds.conversionId || 'not_set'}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-auto h-6 w-6"
                                            onClick={() => copyToClipboard(config.googleAds.conversionId)}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                        <span className="text-green-600">NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL</span>
                                        <span className="text-muted-foreground">=</span>
                                        <span>{config.googleAds.conversionLabel || 'not_set'}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-auto h-6 w-6"
                                            onClick={() => copyToClipboard(config.googleAds.conversionLabel)}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </>
                            )}
                            {config.metaAds.enabled && (
                                <>
                                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                        <span className="text-blue-600">NEXT_PUBLIC_META_PIXEL_ID</span>
                                        <span className="text-muted-foreground">=</span>
                                        <span>{config.metaAds.pixelId || 'not_set'}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-auto h-6 w-6"
                                            onClick={() => copyToClipboard(config.metaAds.pixelId)}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    {config.metaAds.accessToken && (
                                        <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                            <span className="text-blue-600">META_ACCESS_TOKEN</span>
                                            <span className="text-muted-foreground">=</span>
                                            <span className="text-muted-foreground">••••••••••••••••</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="ml-auto h-6 w-6"
                                                onClick={() => copyToClipboard(config.metaAds.accessToken)}
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                            {config.googleAnalytics.enabled && (
                                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                    <span className="text-orange-600">NEXT_PUBLIC_GOOGLE_ANALYTICS_ID</span>
                                    <span className="text-muted-foreground">=</span>
                                    <span>{config.googleAnalytics.measurementId || 'not_set'}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-auto h-6 w-6"
                                        onClick={() => copyToClipboard(config.googleAnalytics.measurementId)}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Implementation Steps */}
                <Card>
                    <CardHeader>
                        <CardTitle>Implementation Guide</CardTitle>
                        <CardDescription>
                            Follow these steps to integrate tracking in your storefront
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-3">
                                <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">1</Badge>
                                <div>
                                    <p className="font-medium">Configure Your Tracking IDs</p>
                                    <p className="text-muted-foreground text-xs mt-1">
                                        Enter your conversion tracking credentials above and save the settings
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">2</Badge>
                                <div>
                                    <p className="font-medium">Tracked Events</p>
                                    <p className="text-muted-foreground text-xs mt-1">
                                        Purchase, Add to Cart, View Product, Search, and more
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">3</Badge>
                                <div>
                                    <p className="font-medium">Verification</p>
                                    <p className="text-muted-foreground text-xs mt-1">
                                        Use browser extensions to verify tracking is working correctly
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

