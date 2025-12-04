'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, Store } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function NewStorePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        subdomain: '',
        customDomain: '',
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await api.post('/api/stores', {
                name: formData.name,
                subdomain: formData.subdomain.toLowerCase(),
                customDomain: formData.customDomain || null,
            })

            console.log('API Response:', response)

            // The api.post returns the data directly, not wrapped in a .data property
            const newStore = response

            if (!newStore || !newStore.id) {
                console.error('Invalid response from API:', newStore)
                throw new Error('Invalid response from server')
            }

            toast.success('Store created successfully!')

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
        // Only allow lowercase letters, numbers, and hyphens
        const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
        setFormData({ ...formData, subdomain: sanitized })
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <Heading
                    title="Create Store"
                    description="Set up a new store for your business"
                />
            </div>
            <Separator />

            <Card className="max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        <CardTitle>Store Details</CardTitle>
                    </div>
                    <CardDescription>
                        Enter the details for your new store
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Store Name *</Label>
                            <Input
                                id="name"
                                placeholder="My Awesome Store"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                This is the name that will appear in your admin panel
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subdomain">Subdomain *</Label>
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
                                Your store will be accessible at {formData.subdomain || 'yourstore'}.galamine.com
                            </p>
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
                                You can add a custom domain later in store settings
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Store'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
