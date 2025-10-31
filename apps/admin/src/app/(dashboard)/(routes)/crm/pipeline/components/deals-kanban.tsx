'use client'

import { useState, useMemo } from 'react'
import { EnrichedDeal, DealStage } from '@/lib/mock-data/crm-unified'
import { KanbanBoard } from '@/components/crm/kanban-board'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Mail, Calendar, DollarSign, TrendingUp, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'

interface DealsKanbanProps {
  deals: EnrichedDeal[]
}

const DEAL_STAGES: DealStage[] = ['discovery', 'proposal', 'negotiation', 'decision', 'won', 'lost']

export function DealsKanban({ deals: initialDeals }: DealsKanbanProps) {
  const router = useRouter()
  const [deals, setDeals] = useState<EnrichedDeal[]>(initialDeals)

  const columns = useMemo(() => DEAL_STAGES.map((stage) => ({
    id: stage,
    title: getStageTitle(stage),
    items: deals
      .filter((deal) => deal.stage === stage)
      .map((deal) => ({
        id: deal.id,
        title: deal.name,
        subtitle: deal.contact.company,
        value: `$${(deal.value / 1000).toFixed(0)}K`,
        metadata: deal,
      })),
    color: getStageColor(stage),
  })), [deals])

  const handleItemClick = (item: any) => {
    router.push(`/crm/pipeline/${item.id}`)
  }

  const handleMove = (itemId: string, fromColumnId: string, toColumnId: string) => {
    const deal = deals.find(d => d.id === itemId)
    if (!deal || fromColumnId === toColumnId) return

    const newStage = toColumnId as DealStage
    const newDeals = deals.map(d =>
      d.id === itemId ? { ...d, stage: newStage } : d
    )

    setDeals(newDeals)

    toast.success(`Moved ${deal.name} to ${getStageTitle(newStage)}`, {
      icon: '✅',
    })
  }

  const renderCard = (item: any) => {
    const deal: EnrichedDeal = item.metadata

    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 space-y-3">
          <div>
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-semibold text-sm">{deal.name}</h4>
              <div className={`text-xs font-semibold px-2 py-0.5 rounded ${getProbabilityColor(deal.probability)}`}>
                {deal.probability}%
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Building2 className="h-3 w-3" />
              <span>{deal.contact.company}</span>
            </div>
          </div>

          {/* Show if converted from lead */}
          {deal.lead && (
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              From Lead (Score: {deal.lead.score})
            </Badge>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">{deal.contact.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{deal.contact.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Close: {format(new Date(deal.expectedCloseDate), 'MMM d')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex gap-1">
              {deal.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-green-600">
              <DollarSign className="h-3 w-3" />
              {(deal.value / 1000).toFixed(0)}K
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{deal.assignedTo}</span>
            <span>{deal.activities.length} activities</span>
          </div>

          {deal.activities.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Last activity: {format(new Date(deal.lastActivityAt), 'MMM d')}
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

function getStageTitle(stage: DealStage): string {
  const titles: Record<DealStage, string> = {
    discovery: 'Discovery',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    decision: 'Decision',
    won: 'Won',
    lost: 'Lost',
  }
  return titles[stage]
}

function getStageColor(stage: DealStage): string {
  const colors: Record<DealStage, string> = {
    discovery: 'bg-blue-500',
    proposal: 'bg-yellow-500',
    negotiation: 'bg-orange-500',
    decision: 'bg-purple-500',
    won: 'bg-green-500',
    lost: 'bg-gray-500',
  }
  return colors[stage]
}

function getProbabilityColor(probability: number): string {
  if (probability >= 75) return 'bg-green-100 text-green-800'
  if (probability >= 50) return 'bg-yellow-100 text-yellow-800'
  if (probability >= 25) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

