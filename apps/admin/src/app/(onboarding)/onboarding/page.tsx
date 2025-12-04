'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Check, Loader2, Store, Sparkles, ArrowRight } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        // Merchant info
        merchantName: '',
        businessType: '',
        // Store info
        storeName: '',
        subdomain: '',
        customDomain: '',
    })

    const totalSteps = 3
    const progress = (step / totalSteps) * 100

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (step < totalSteps) {
            setStep(step + 1)
            return
        }

        // Final step - create store
        setLoading(true)

        try {
            const response = await api.post('/api/stores', {
                name: formData.storeName,
                subdomain: formData.subdomain.toLowerCase(),
                customDomain: formData.customDomain || null,
            })

            const newStore = response

            if (!newStore || !newStore.id) {
                throw new Error('Invalid response from server')
            }

            toast.success('Welcome! Your store is ready! 🎉')

            // Set as current store
            document.cookie = `currentStoreId=${newStore.id}; path=/; max-age=31536000`

            // Redirect to dashboard
            router.push('/')
        } catch (error: any) {
            console.error('Failed to create store:', error)
            toast.error(error.message || 'Failed to create store')
        } finally {
            setLoading(false)
        }
    }

    function handleSubdomainChange(value: string) {
        const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
        setFormData({ ...formData, subdomain: sanitized })
    }

    function handleBack() {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="text-center">
                        <CardTitle className="text-3xl">
                            {step === 1 && "Welcome to Avelon! 👋"}
                            {step === 2 && "Let's set up your store"}
                            {step === 3 && "Almost done!"}
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                            {step === 1 && "Tell us a bit about yourself to get started"}
                            {step === 2 && "Choose a name and address for your store"}
                            {step === 3 && "Review and create your store"}
                        </CardDescription>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Step {step} of {totalSteps}</span>
                            <span>{Math.round(progress)}% complete</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Step 1: Merchant Info */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="merchantName">Your Name *</Label>
                                    <Input
                                        id="merchantName"
                                        placeholder="John Doe"
                                        value={formData.merchantName}
                                        onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        This helps us personalize your experience
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="businessType">What type of business? (Optional)</Label>
                                    <Input
                                        id="businessType"
                                        placeholder="e.g., Fashion, Electronics, Home Decor"
                                        value={formData.businessType}
                                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Helps us provide relevant features
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Store Info */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">Store Name *</Label>
                                    <Input
                                        id="storeName"
                                        placeholder="My Awesome Store"
                                        value={formData.storeName}
                                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        This will appear in your admin panel and to customers
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subdomain">Store Address (Subdomain) *</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="subdomain"
                                            placeholder="mystore"
                                            value={formData.subdomain}
                                            onChange={(e) => handleSubdomainChange(e.target.value)}
                                            required
                                            pattern="[a-z0-9-]+"
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                                            .galamine.com
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Your store: <strong>{formData.subdomain || 'yourstore'}.galamine.com</strong>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Your Information</span>
                                    </div>
                                    <div className="ml-6 space-y-1 text-sm">
                                        <p><strong>Name:</strong> {formData.merchantName}</p>
                                        {formData.businessType && (
                                            <p><strong>Business:</strong> {formData.businessType}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Store className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Your Store</span>
                                    </div>
                                    <div className="ml-6 space-y-1 text-sm">
                                        <p><strong>Name:</strong> {formData.storeName}</p>
                                        <p><strong>URL:</strong> {formData.subdomain}.galamine.com</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                                    <Input
                                        id="customDomain"
                                        placeholder="www.mystore.com"
                                        value={formData.customDomain}
                                        onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        You can add or change this later
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 pt-4">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={loading || (step === 1 && !formData.merchantName) || (step === 2 && (!formData.storeName || !formData.subdomain))}
                                className="flex-1"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : step === totalSteps ? (
                                    <>
                                        Create Store
                                        <Check className="ml-2 h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
