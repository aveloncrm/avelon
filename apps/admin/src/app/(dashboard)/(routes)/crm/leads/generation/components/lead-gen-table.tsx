'use client'

import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { LeadGenerationCampaign } from '@/lib/mock-data/crm-campaigns'
import { StatusBadge } from '@/components/crm/status-badge'
import { EditIcon, TrendingUp, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { Progress } from '@/components/ui/progress'

export const columns: ColumnDef<LeadGenerationCampaign>[] = [
  {
    accessorKey: 'name',
    header: 'Campaign Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <Badge variant="outline" className="mt-1">
          {row.original.type}
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
    accessorKey: 'leadsGenerated',
    header: 'Leads',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">{row.original.leadsGenerated}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.qualifiedLeads} qualified
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'conversionRate',
    header: 'Conversion',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3 w-3 text-green-600" />
          <span className="font-medium">{row.original.conversionRate}%</span>
        </div>
        <Progress value={row.original.conversionRate} className="h-1 w-16" />
      </div>
    ),
  },
  {
    accessorKey: 'budget',
    header: 'Budget',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="text-sm font-medium">
          ${row.original.spent.toLocaleString()} / ${row.original.budget.toLocaleString()}
        </div>
        <Progress
          value={(row.original.spent / row.original.budget) * 100}
          className="h-1 w-24"
        />
      </div>
    ),
  },
  {
    accessorKey: 'costPerLead',
    header: 'Cost/Lead',
    cell: ({ row }) => (
      <div className="font-medium text-green-600">${row.original.costPerLead}</div>
    ),
  },
  {
    accessorKey: 'channels',
    header: 'Channels',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.channels.slice(0, 2).map((channel) => (
          <Badge key={channel} variant="secondary" className="text-xs">
            {channel}
          </Badge>
        ))}
        {row.original.channels.length > 2 && (
          <Badge variant="secondary" className="text-xs">
            +{row.original.channels.length - 2}
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'startDate',
    header: 'Period',
    cell: ({ row }) => (
      <div className="text-sm">
        <div>{format(new Date(row.original.startDate), 'MMM d')}</div>
        <div className="text-muted-foreground">
          {row.original.endDate ? format(new Date(row.original.endDate), 'MMM d') : 'Ongoing'}
        </div>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/crm/leads/generation/${row.original.id}`}>
        <Button size="icon" variant="outline">
          <EditIcon className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
]

interface LeadGenTableProps {
  data: LeadGenerationCampaign[]
}

export function LeadGenTable({ data }: LeadGenTableProps) {
  return <DataTable searchKey="name" columns={columns} data={data} />
}

