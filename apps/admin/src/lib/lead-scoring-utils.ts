// Shared utilities for lead scoring and classification

export type LeadScoreCategory = 'hot' | 'warm' | 'cold'

export interface LeadScoreConfig {
  label: string
  color: string
  bgColor: string
  textColor: string
  icon: string
}

export const LEAD_SCORE_CONFIGS: Record<LeadScoreCategory, LeadScoreConfig> = {
  hot: {
    label: 'Hot Lead',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: '🔥',
  },
  warm: {
    label: 'Warm Lead',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: '🌡️',
  },
  cold: {
    label: 'Cold Lead',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: '❄️',
  },
}

export function getLeadScoreCategory(score: number): LeadScoreCategory {
  if (score >= 80) return 'hot'
  if (score >= 60) return 'warm'
  return 'cold'
}

export function getLeadScoreConfig(score: number): LeadScoreConfig {
  const category = getLeadScoreCategory(score)
  return LEAD_SCORE_CONFIGS[category]
}

export function getLeadScoreLabel(score: number): string {
  return getLeadScoreConfig(score).label
}

export function getLeadScoreColor(score: number): string {
  return getLeadScoreConfig(score).color
}

export function getLeadScoreBgColor(score: number): string {
  return getLeadScoreConfig(score).bgColor
}

export function getLeadScoreTextColor(score: number): string {
  return getLeadScoreConfig(score).textColor
}

export function isLeadUntouched(lastContactedAt: string | null): boolean {
  return lastContactedAt === null
}

export function getPriorityConfig(priority: 'low' | 'medium' | 'high' | 'urgent') {
  const configs = {
    low: {
      label: 'Low Priority',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
    },
    medium: {
      label: 'Medium Priority',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    high: {
      label: 'High Priority',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
    },
    urgent: {
      label: 'Urgent',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
  }
  return configs[priority]
}

