import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'outline'
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Lead statuses
  new: { label: 'New', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  contacted: { label: 'Contacted', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  qualified: { label: 'Qualified', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  unqualified: { label: 'Unqualified', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
  converted: { label: 'Converted', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
  
  // Deal stages
  lead: { label: 'Lead', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  proposal: { label: 'Proposal', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  negotiation: { label: 'Negotiation', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  closed_won: { label: 'Closed Won', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  closed_lost: { label: 'Closed Lost', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  
  // Campaign statuses
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
  scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  active: { label: 'Active', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  paused: { label: 'Paused', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  completed: { label: 'Completed', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
}

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: '' }
  
  return (
    <Badge
      variant={variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  )
}

