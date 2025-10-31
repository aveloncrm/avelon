'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Sparkles, RefreshCw, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIPromptBuilderProps {
  onGenerate: (config: GenerateConfig) => void
  loading?: boolean
  className?: string
}

export interface GenerateConfig {
  prompt: string
  tone: string
  length: string
}

const toneOptions = [
  { value: 'professional', label: 'Professional', emoji: '👔' },
  { value: 'casual', label: 'Casual', emoji: '😊' },
  { value: 'witty', label: 'Witty', emoji: '😄' },
  { value: 'inspirational', label: 'Inspirational', emoji: '✨' },
  { value: 'educational', label: 'Educational', emoji: '📚' },
]

const lengthOptions = [
  { value: 'short', label: 'Short', description: '50-100 characters' },
  { value: 'medium', label: 'Medium', description: '100-200 characters' },
  { value: 'long', label: 'Long', description: '200+ characters' },
]

const promptSuggestions = [
  'New product launch announcement',
  'Behind-the-scenes company culture',
  'Customer success story',
  'Tips and tricks for our industry',
  'Upcoming event or webinar',
  'Special offer or promotion',
]

export function AIPromptBuilder({ onGenerate, loading = false, className }: AIPromptBuilderProps) {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')

  const handleGenerate = () => {
    if (!prompt.trim()) return
    onGenerate({ prompt, tone, length })
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label htmlFor="ai-prompt">What would you like to post about?</Label>
        <Textarea
          id="ai-prompt"
          placeholder="E.g., Announce our new AI-powered feature that helps users save time..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Quick suggestions:</span>
          {promptSuggestions.map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {toneOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    <span>{option.emoji}</span>
                    <span>{option.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="length">Length</Label>
          <Select value={length} onValueChange={setLength}>
            <SelectTrigger id="length">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lengthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (prompt.trim()) onGenerate({ prompt, tone, length })
          }}
          disabled={!prompt.trim() || loading}
          title="Generate variations"
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

