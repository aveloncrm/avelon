'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'

const formSchema = z.object({
    code: z.string().min(1),
    percent: z.coerce.number().min(0).max(100),
    maxDiscountAmount: z.coerce.number().min(0),
    stock: z.coerce.number().int().min(0),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
})

type DiscountFormValues = z.infer<typeof formSchema>

interface DiscountFormProps {
    onSubmit: (data: DiscountFormValues) => void
    loading: boolean
    initialData?: Partial<DiscountFormValues>
}

export const DiscountForm: React.FC<DiscountFormProps> = ({ onSubmit, loading, initialData }) => {
    const form = useForm<DiscountFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: initialData?.code ?? '',
            percent: initialData?.percent ?? 0,
            maxDiscountAmount: initialData?.maxDiscountAmount ?? 0,
            stock: initialData?.stock ?? 0,
            startDate: initialData?.startDate ? format(new Date(initialData.startDate), 'yyyy-MM-dd') : '',
            endDate: initialData?.endDate ? format(new Date(initialData.endDate), 'yyyy-MM-dd') : '',
        },
    })

    const handleSubmit = (data: DiscountFormValues) => {
        onSubmit(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="DISCOUNT2025" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="percent"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Percent</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="10" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="maxDiscountAmount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Discount Amount</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="50" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stock (uses)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="100" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <Input type="date" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <Input type="date" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Separator />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </form>
        </Form>
    )
}
