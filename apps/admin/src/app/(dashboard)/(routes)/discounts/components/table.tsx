'use client'

import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'

export type DiscountColumn = {
    id: string
    code: string
    percent: string
    maxDiscountAmount: string
    stock: number
    startDate: string
    endDate: string
}

export const columns: ColumnDef<DiscountColumn>[] = [
    {
        accessorKey: 'code',
        header: 'Code',
    },
    {
        accessorKey: 'percent',
        header: 'Percent',
    },
    {
        accessorKey: 'maxDiscountAmount',
        header: 'Max Discount',
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
    },
    {
        accessorKey: 'startDate',
        header: 'Start Date',
    },
    {
        accessorKey: 'endDate',
        header: 'End Date',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <Link href={`/discounts/${row.original.id}`}>
                <button className="flex items-center gap-1 text-sm text-primary underline">
                    <EditIcon className="h-4 w-4" /> Edit
                </button>
            </Link>
        ),
    },
]

export const DiscountsTable: React.FC<{ data: DiscountColumn[] }> = ({ data }) => {
    return <DataTable columns={columns} data={data} searchKey="code" />
}
