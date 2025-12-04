'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import { DiscountForm } from '../components/form'

export default function NewDiscountPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            await api.post('/api/discounts', data)
            toast.success('Discount created')
            router.push('/discounts')
        } catch {
            toast.error('Failed to create discount')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="block space-y-4 my-6">
            <Heading title="Create Discount" description="Add a new discount code" />
            <Separator />
            <DiscountForm onSubmit={onSubmit} loading={loading} />
        </div>
    )
}
