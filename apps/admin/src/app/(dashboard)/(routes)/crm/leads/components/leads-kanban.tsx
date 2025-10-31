'use client'

import { useState, useMemo } from 'react'
import { EnrichedLead, LeadStatus } from '@/lib/mock-data/crm-unified'
import { KanbanBoard } from '@/components/crm/kanban-board'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PriorityBadge } from '@/components/crm/priority-badge'
import { Mail, Phone, Building2, Briefcase, TrendingUp, Target, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getLeadScoreConfig, isLeadUntouched, getPriorityConfig } from '@/lib/lead-scoring-utils'
import { toast } from 'react-hot-toast'

interface LeadsKanbanProps {
  leads: EnrichedLead[]
}

const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'unqualified', 'converted']

export function LeadsKanban({ leads: initialLeads }: LeadsKanbanProps) {
  const router = useRouter()
  const [leads, setLeads] = useState<EnrichedLead[]>(initialLeads)

  const columns = useMemo(() => LEAD_STATUSES.map((status) => ({
    id: status,
    title: status.charAt(0).toUpperCase() + status.slice(1),
    items: leads
      .filter((lead) => lead.status === status)
      .map((lead) => ({
        id: lead.id,
        title: lead.contact.name,
        subtitle: lead.contact.company,
        value: `$${(lead.estimatedValue / 1000).toFixed(0)}K`,
        metadata: lead,
      })),
    color: getStatusColor(status),
  })), [leads])

  const handleItemClick = (item: any) => {
    router.push(`/crm/leads/${item.id}`)
  }

  const handleMove = (itemId: string, fromColumnId: string, toColumnId: string) => {
    const lead = leads.find(l => l.id === itemId)
    if (!lead || fromColumnId === toColumnId) return

    const newStatus = toColumnId as LeadStatus
    const newLeads = leads.map(l =>
      l.id === itemId ? { ...l, status: newStatus } : l
    )

    setLeads(newLeads)

    toast.success(`Moved ${lead.contact.name} to ${toColumnId.charAt(0).toUpperCase() + toColumnId.slice(1)}`, {
      icon: '✅',
    })
  }

  const renderCard = (item: any) => {
    const lead: EnrichedLead = item.metadata
    const scoreConfig = getLeadScoreConfig(lead.score)
    getPriorityConfig(lead.priority)
    const untouched = isLeadUntouched(lead.lastContactedAt)

    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: scoreConfig.color }}>
        <CardContent className="p-4 space-y-3">
          {/* Lead Score Badge - Prominent */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={`${scoreConfig.bgColor} ${scoreConfig.textColor} text-sm font-bold px-3 py-1`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {lead.score} - {scoreConfig.label}
            </Badge>
            <PriorityBadge priority={lead.priority} showIcon={lead.priority === 'urgent'} />
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">{lead.contact.name}</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Building2 className="h-3 w-3" />
              <span>{lead.contact.company}</span>
            </div>
          </div>

          {/* Lead Classification Badges */}
          <div className="flex flex-wrap gap-1">
            {/* Untouched Badge */}
            {untouched && (
              <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                <AlertCircle className="h-3 w-3 mr-1" />
                Untouched
              </Badge>
            )}

            {/* Converted Badge */}
            {lead.status === 'converted' && lead.deal && (
              <Badge variant="default" className="bg-green-600 text-xs">
                <Target className="h-3 w-3 mr-1" />
                Converted
              </Badge>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Briefcase className="h-3 w-3" />
              <span>{lead.contact.jobTitle}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{lead.contact.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{lead.contact.phone}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              <div>Value: <span className="font-semibold text-foreground">${(lead.estimatedValue / 1000).toFixed(0)}K</span></div>
            </div>
            <div className="text-xs text-muted-foreground">
              {lead.assignedTo}
            </div>
          </div>

          {lead.activities && lead.activities.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {lead.activities.length} activity{lead.activities.length !== 1 ? 'ies' : ''}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <KanbanBoard
        columns={columns}
        onItemClick={handleItemClick}
        onChange={handleMove}
        renderCard={renderCard}
      />
    </div>
  )
}

function getStatusColor(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    qualified: 'bg-green-500',
    unqualified: 'bg-gray-500',
    converted: 'bg-purple-500',
  }
  return colors[status]
}

