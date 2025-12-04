'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus, Store, ExternalLink } from 'lucide-react'
import api from '@/lib/api'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface StoreData {
    id: string
    name: string
    subdomain: string
    customDomain?: string | null
    createdAt: string
}

export default function StoresPage() {
    const router = useRouter()
    const [stores, setStores] = useState<StoreData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStores()
    }, [])

    async function loadStores() {
        try {
            // The api.get returns the data directly, not wrapped in a .data property
            const storesData = await api.get('/api/merchants/stores')
            setStores(storesData)
        } catch (error) {
            console.error('Failed to load stores:', error)
        } finally {
            setLoading(false)
        }
    }

    function switchToStore(storeId: string) {
        document.cookie = `currentStoreId=${storeId}; path=/; max-age=31536000`
        router.push('/')
    }

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading title="Stores" description="Loading your stores..." />
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading
                    title="Stores"
                    description="Manage your stores and create new ones"
                />
                <Button onClick={() => router.push('/stores/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Store
                </Button>
            </div>
            <Separator />

            {stores.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No stores yet</CardTitle>
                        <CardDescription>
                            Create your first store to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push('/stores/new')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Store
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stores.map((store) => (
                        <Card key={store.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <Store className="h-5 w-5" />
                                        <CardTitle>{store.name}</CardTitle>
                                    </div>
                                </div>
                                <CardDescription>
                                    <div className="flex flex-col gap-1 mt-2">
                                        <a
                                            href={`https://${store.subdomain}.galamine.com`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sm hover:underline"
                                        >
                                            {store.subdomain}.galamine.com
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                        {store.customDomain && (
                                            <a
                                                href={`https://${store.customDomain}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm hover:underline"
                                            >
                                                {store.customDomain}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => switchToStore(store.id)}
                                        className="flex-1"
                                    >
                                        Switch To
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/stores/${store.id}`)}
                                        className="flex-1"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
