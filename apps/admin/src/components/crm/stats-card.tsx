import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  className?: string
}

export function StatsCard({ label, value, change, changeType = 'neutral', className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground mb-2">{label}</div>
        <div className="text-3xl font-bold">{value}</div>
        {change && (
          <div
            className={cn(
              'text-xs font-medium mt-2',
              changeType === 'increase' && 'text-green-600',
              changeType === 'decrease' && 'text-red-600',
              changeType === 'neutral' && 'text-muted-foreground'
            )}
          >
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

