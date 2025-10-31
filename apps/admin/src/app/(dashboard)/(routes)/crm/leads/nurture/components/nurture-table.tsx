'use client'

import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { NurtureCampaign } from '@/lib/mock-data/crm-campaigns'
import { StatusBadge } from '@/components/crm/status-badge'
import { EditIcon, Mail, MousePointer } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'

export const columns: ColumnDef<NurtureCampaign>[] = [
  {
    accessorKey: 'name',
    header: 'Campaign Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <Badge variant="outline" className="mt-1">
          {row.original.type.replace(/_/g, ' ')}
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
    accessorKey: 'targetSegment',
    header: 'Target Segment',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.targetSegment}</span>
    ),
  },
  {
    accessorKey: 'emailsSent',
    header: 'Emails Sent',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-3 w-3 text-muted-foreground" />
        <span className="font-medium">{row.original.emailsSent}</span>
      </div>
    ),
  },
  {
    accessorKey: 'opensRate',
    header: 'Open Rate',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-3 w-3 text-blue-600" />
        <span className="font-medium">{row.original.opensRate}%</span>
      </div>
    ),
  },
  {
    accessorKey: 'clicksRate',
    header: 'Click Rate',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MousePointer className="h-3 w-3 text-green-600" />
        <span className="font-medium">{row.original.clicksRate}%</span>
      </div>
    ),
  },
  {
    accessorKey: 'conversions',
    header: 'Conversions',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-green-600">{row.original.conversions}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.conversionRate}% rate
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
    accessorKey: 'startDate',
    header: 'Started',
    cell: ({ row }) => format(new Date(row.original.startDate), 'MMM d, yyyy'),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/crm/leads/nurture/${row.original.id}`}>
        <Button size="icon" variant="outline">
          <EditIcon className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
]

interface NurtureCampaignsTableProps {
  data: NurtureCampaign[]
}

export function NurtureCampaignsTable({ data }: NurtureCampaignsTableProps) {
  return <DataTable searchKey="name" columns={columns} data={data} />
}

