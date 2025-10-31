'use client'

import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { EnrichedLead } from '@/lib/mock-data/crm-unified'
import { StatusBadge } from '@/components/crm/status-badge'
import { PriorityBadge } from '@/components/crm/priority-badge'
import { EditIcon, MailIcon, PhoneIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'

export const columns: ColumnDef<EnrichedLead>[] = [
  {
    accessorKey: 'contact.name',
    header: 'Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.contact.name}</div>
        <div className="text-xs text-muted-foreground">{row.original.contact.jobTitle}</div>
      </div>
    ),
  },
  {
    accessorKey: 'contact.company',
    header: 'Company',
    cell: ({ row }) => row.original.contact.company,
  },
  {
    accessorKey: 'contact.email',
    header: 'Contact',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-sm">
          <MailIcon className="h-3 w-3" />
          <span className="truncate max-w-[200px]">{row.original.contact.email}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <PhoneIcon className="h-3 w-3" />
          <span>{row.original.contact.phone}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="font-semibold">{row.original.score}</div>
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-green-500"
            style={{ width: `${row.original.score}%` }}
          />
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.source.replace(/_/g, ' ')}</Badge>
    ),
  },
  {
    accessorKey: 'estimatedValue',
    header: 'Value',
    cell: ({ row }) => (
      <div className="font-medium">${(row.original.estimatedValue / 1000).toFixed(0)}K</div>
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy'),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/crm/leads/${row.original.id}`}>
        <Button size="icon" variant="outline">
          <EditIcon className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
]

interface LeadsTableProps {
  data: EnrichedLead[]
}

export function LeadsTable({ data }: LeadsTableProps) {
  return <DataTable searchKey="name" columns={columns} data={data} />
}

