'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
import { ArrowLeft, Store, Trash } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface StoreData {
    id: string
    name: string
    subdomain: string
    customDomain?: string | null
}

export default function EditStorePage() {
    const router = useRouter()
    const params = useParams()
    const storeId = params.storeId as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        subdomain: '',
        customDomain: '',
    })

    const loadStore = useCallback(async () => {
        try {
            // The api.get returns the data directly, not wrapped in a .data property
            const store: StoreData = await api.get(`/api/stores/${storeId}`)
            setFormData({
                name: store.name,
                subdomain: store.subdomain,
                customDomain: store.customDomain || '',
            })
        } catch (error: any) {
            console.error('Failed to load store:', error)
            toast.error(error.message || 'Failed to load store')
            router.push('/stores')
        } finally {
            setLoading(false)
        }
    }, [storeId, router])

    useEffect(() => {
        loadStore()
    }, [loadStore])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        try {
            await api.patch(`/api/stores/${storeId}`, {
                name: formData.name,
                subdomain: formData.subdomain.toLowerCase(),
                customDomain: formData.customDomain || null,
            })

            toast.success('Store updated successfully!')
            router.push('/stores')
        } catch (error: any) {
            console.error('Failed to update store:', error)
            toast.error(error.message || 'Failed to update store')
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete() {
        setDeleting(true)

        try {
            await api.delete(`/api/stores/${storeId}`)
            toast.success('Store deleted successfully!')
            router.push('/stores')
        } catch (error: any) {
            console.error('Failed to delete store:', error)
            toast.error(error.response?.data || 'Failed to delete store')
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Loading..." description="Please wait" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <Heading title="Edit Store" description="Update your store settings" />
            </div>
            <Separator />

            <Card className="max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        <CardTitle>Store Settings</CardTitle>
                    </div>
                    <CardDescription>Update your store information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Store Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subdomain">Subdomain *</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="subdomain"
                                    value={formData.subdomain}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                                        })
                                    }
                                    required
                                    pattern="[a-z0-9-]+"
                                />
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                    .galamine.com
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                            <Input
                                id="customDomain"
                                value={formData.customDomain}
                                onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-between">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" variant="destructive" disabled={deleting}>
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete Store
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your store and all
                                            associated data including products, orders, and customers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
