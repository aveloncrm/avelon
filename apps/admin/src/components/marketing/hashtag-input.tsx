'use client'

import { useState, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HashtagInputProps {
  hashtags: string[]
  onChange: (hashtags: string[]) => void
  suggestions?: string[]
  maxHashtags?: number
  className?: string
}

const trendingHashtags = [
  '#AI',
  '#Innovation',
  '#Tech',
  '#Business',
  '#Marketing',
  '#ProductLaunch',
  '#Growth',
  '#Success',
]

export function HashtagInput({
  hashtags,
  onChange,
  suggestions = trendingHashtags,
  maxHashtags = 30,
  className,
}: HashtagInputProps) {
  const [input, setInput] = useState('')

  const addHashtag = (tag: string) => {
    const cleanTag = tag.trim().replace(/^#+/, '')
    if (cleanTag && !hashtags.includes(cleanTag) && hashtags.length < maxHashtags) {
      onChange([...hashtags, cleanTag])
      setInput('')
    }
  }

  const removeHashtag = (tag: string) => {
    onChange(hashtags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addHashtag(input)
    } else if (e.key === 'Backspace' && !input && hashtags.length > 0) {
      removeHashtag(hashtags[hashtags.length - 1])
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Hashtags</label>
        <div className="border rounded-lg p-2 focus-within:ring-2 focus-within:ring-ring">
          <div className="flex flex-wrap gap-2 mb-2">
            {hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="pl-2">
                #{tag}
                <button
                  type="button"
                  onClick={() => removeHashtag(tag)}
                  className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add hashtags (press Enter or comma)"
            className="border-0 shadow-none focus-visible:ring-0 p-0"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {hashtags.length}/{maxHashtags} hashtags • Press Enter or comma to add
        </p>
      </div>

      {suggestions.length > 0 && hashtags.length < maxHashtags && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            <span>Trending & Suggested</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions
              .filter((s) => !hashtags.includes(s.replace('#', '')))
              .slice(0, 8)
              .map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => addHashtag(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

