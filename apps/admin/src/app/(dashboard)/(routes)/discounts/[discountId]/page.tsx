'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import { DiscountForm } from '../components/form'

export default function EditDiscountPage() {
    const { discountId } = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [initialData, setInitialData] = useState<any>(null)

    useEffect(() => {
        async function fetchDiscount() {
            try {
                const data = await api.get(`/api/discounts/${discountId}`)
                setInitialData(data)
            } catch {
                toast.error('Failed to load discount')
            } finally {
                setLoading(false)
            }
        }
        fetchDiscount()
    }, [discountId])

    const onSubmit = async (formData: any) => {
        setLoading(true)
        try {
            await api.patch(`/api/discounts/${discountId}`, formData)
            toast.success('Discount updated')
            router.push('/discounts')
        } catch {
            toast.error('Failed to update discount')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="block space-y-4 my-6">
            <Heading title="Edit Discount" description="Update discount details" />
            <Separator />
            <DiscountForm onSubmit={onSubmit} loading={loading} initialData={initialData} />
        </div>
    )
}
