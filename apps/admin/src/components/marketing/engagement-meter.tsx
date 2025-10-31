'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EngagementMeterProps {
  score: number
  className?: string
}

export function EngagementMeter({ score, className }: EngagementMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <TrendingUp className="h-5 w-5 text-yellow-600" />
    return <AlertCircle className="h-5 w-5 text-orange-600" />
  }

  const suggestions = [
    score < 60 && 'Consider adding emojis to increase engagement',
    score < 70 && 'Add trending hashtags to improve reach',
    score < 80 && 'Include a call-to-action to boost interaction',
    score < 90 && 'Consider posting at optimal times',
  ].filter(Boolean)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          {getScoreIcon(score)}
          Engagement Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Predicted Score</span>
            <span className={cn('text-2xl font-bold', getScoreColor(score))}>
              {score}
            </span>
          </div>
          <Progress value={score} className="h-3" />
          <p className="text-xs text-muted-foreground">
            This post is rated as <span className="font-medium">{getScoreLabel(score)}</span>
          </p>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Suggestions:</p>
            <ul className="space-y-1">
              {suggestions.map((suggestion, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

