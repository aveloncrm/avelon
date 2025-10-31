'use client'

import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { OutreachSequence } from '@/lib/mock-data/crm-sequences'
import { StatusBadge } from '@/components/crm/status-badge'
import { EditIcon, Users, MessageSquare, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'

export const columns: ColumnDef<OutreachSequence>[] = [
  {
    accessorKey: 'name',
    header: 'Sequence Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <Badge variant="outline" className="mt-1">
          {row.original.channel}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'enrolled',
    header: 'Enrolled',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">{row.original.enrolled}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.active} active
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'steps',
    header: 'Steps',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.steps.length} steps</Badge>
    ),
  },
  {
    accessorKey: 'replied',
    header: 'Replies',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-3 w-3 text-green-600" />
          <span className="font-medium">{row.original.replied}</span>
        </div>
        <div className="text-xs font-semibold text-green-600">
          {row.original.replyRate}% rate
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'booked',
    header: 'Meetings',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-purple-600" />
          <span className="font-medium">{row.original.booked}</span>
        </div>
        <div className="text-xs font-semibold text-purple-600">
          {row.original.bookingRate}% rate
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'completed',
    header: 'Completed',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.completed}</div>
        <div className="text-xs text-muted-foreground">
          {((row.original.completed / row.original.enrolled) * 100).toFixed(0)}% of enrolled
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy'),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/crm/outreach/sequences/${row.original.id}`}>
          <Button size="icon" variant="outline">
            <EditIcon className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
]

interface SequencesTableProps {
  data: OutreachSequence[]
}

export function SequencesTable({ data }: SequencesTableProps) {
  return <DataTable searchKey="name" columns={columns} data={data} />
}

