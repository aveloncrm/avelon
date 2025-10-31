'use client'

import { PlatformType, getAllPlatforms } from '@/lib/mock-data/marketing-platforms'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PlatformSelectorProps {
  selected: PlatformType[]
  onChange: (platforms: PlatformType[]) => void
  className?: string
}

export function PlatformSelector({ selected, onChange, className }: PlatformSelectorProps) {
  const platforms = getAllPlatforms()

  const togglePlatform = (platformId: PlatformType) => {
    if (selected.includes(platformId)) {
      onChange(selected.filter(p => p !== platformId))
    } else {
      onChange([...selected, platformId])
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium">Select Platforms</label>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => {
          const isSelected = selected.includes(platform.id)
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <span className="text-lg">{platform.icon}</span>
              <span className="font-medium">{platform.name}</span>
              {isSelected && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  ✓
                </Badge>
              )}
            </button>
          )
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selected.length} platform{selected.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}

