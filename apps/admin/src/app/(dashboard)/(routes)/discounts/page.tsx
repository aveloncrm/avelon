'use client'

import { useEffect, useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import api from '@/lib/api'
import { DiscountColumn, DiscountsTable } from './components/table'
export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState<DiscountColumn[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchDiscounts() {
            try {
                const data = await api.get('/api/discounts')
                const formatted = data.map((d: any) => ({
                    id: d.id,
                    code: d.code,
                    percent: `${d.percent}%`,
                    maxDiscountAmount: `$${d.maxDiscountAmount}`,
                    stock: d.stock,
                    startDate: new Date(d.startDate).toLocaleDateString(),
                    endDate: new Date(d.endDate).toLocaleDateString(),
                }))
                setDiscounts(formatted)
            } catch (error) {
                console.error('Error fetching discounts:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDiscounts()
    }, [])

    if (loading) return <div>Loading...</div>

    return (
        <div className="block space-y-4 my-6">
            <div className="flex items-center justify-between">
                <Heading title={`Discounts (${discounts.length})`} description="Manage discount codes and coupons" />
                <Link href="/discounts/new">
                    <Button>
                        <Plus className="mr-2 h-4" /> Add New
                    </Button>
                </Link>
            </div>
            <Separator />
            <DiscountsTable data={discounts} />
        </div>
    )
}
