import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AlertCircle, ArrowUp, Minus, Zap } from 'lucide-react'

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent'
  showIcon?: boolean
  className?: string
}

const priorityConfig = {
  low: {
    label: 'Low',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
    icon: Minus,
  },
  medium: {
    label: 'Medium',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    icon: AlertCircle,
  },
  high: {
    label: 'High',
    className: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
    icon: ArrowUp,
  },
  urgent: {
    label: 'Urgent',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
    icon: Zap,
  },
}

export function PriorityBadge({ priority, showIcon = true, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  const Icon = config.icon
  
  return (
    <Badge className={cn(config.className, 'flex items-center gap-1', className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  )
}

