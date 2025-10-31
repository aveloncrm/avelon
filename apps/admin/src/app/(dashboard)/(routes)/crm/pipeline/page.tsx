'use client'

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Plus, DollarSign, Target, TrendingUp, Award } from 'lucide-react'
import { getAllEnrichedDeals, getDealStats } from '@/lib/mock-data/crm-unified'
import { DealsKanban } from './components/deals-kanban'
import { MetricCard } from '@/components/crm/metric-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function PipelinePage() {
  const deals = getAllEnrichedDeals()
  const stats = getDealStats()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Pipeline"
            description="Manage your sales pipeline and track deals"
          />
          <Link href="/crm/pipeline/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Deal
            </Button>
          </Link>
        </div>
        <Separator />

        {/* Quick Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Pipeline Value"
            value={`$${(stats.pipelineValue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            description={`${stats.active} active deals`}
          />
          <MetricCard
            title="Weighted Pipeline"
            value={`$${(stats.weightedPipelineValue / 1000).toFixed(0)}K`}
            icon={Target}
            description="By probability"
            trend={{ value: 12.3, isPositive: true }}
          />
          <MetricCard
            title="Won Deals"
            value={stats.wonDeals}
            icon={Award}
            description={`$${(stats.wonValue / 1000).toFixed(0)}K value`}
            trend={{ value: 8.7, isPositive: true }}
          />
          <MetricCard
            title="Avg Deal Size"
            value={`$${(stats.averageDealSize / 1000).toFixed(0)}K`}
            icon={TrendingUp}
            description="Per deal"
          />
        </div>

        {/* Kanban Board */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <DealsKanban deals={deals} />
          </CardContent>
        </Card>

        {/* Detailed Analytics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: 'Discovery', count: deals.filter(d => d.stage === 'discovery').length, value: deals.filter(d => d.stage === 'discovery').reduce((s, d) => s + d.value, 0), color: 'bg-blue-500' },
                  { stage: 'Proposal', count: deals.filter(d => d.stage === 'proposal').length, value: deals.filter(d => d.stage === 'proposal').reduce((s, d) => s + d.value, 0), color: 'bg-yellow-500' },
                  { stage: 'Negotiation', count: deals.filter(d => d.stage === 'negotiation').length, value: deals.filter(d => d.stage === 'negotiation').reduce((s, d) => s + d.value, 0), color: 'bg-orange-500' },
                  { stage: 'Decision', count: deals.filter(d => d.stage === 'decision').length, value: deals.filter(d => d.stage === 'decision').reduce((s, d) => s + d.value, 0), color: 'bg-purple-500' },
                  { stage: 'Won', count: deals.filter(d => d.stage === 'won').length, value: deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0), color: 'bg-green-500' },
                  { stage: 'Lost', count: deals.filter(d => d.stage === 'lost').length, value: deals.filter(d => d.stage === 'lost').reduce((s, d) => s + d.value, 0), color: 'bg-gray-500' },
                ].map((item) => (
                  <div key={item.stage} className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium">{item.stage}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                          <div
                            className={`h-full ${item.color} flex items-center px-3 text-white text-xs font-medium`}
                            style={{ width: item.count > 0 ? `${Math.max((item.count / Math.max(...Object.values({ discovery: deals.filter(d => d.stage === 'discovery').length, proposal: deals.filter(d => d.stage === 'proposal').length, negotiation: deals.filter(d => d.stage === 'negotiation').length, decision: deals.filter(d => d.stage === 'decision').length, won: deals.filter(d => d.stage === 'won').length, lost: deals.filter(d => d.stage === 'lost').length }))) * 100, 10)}%` : '10%' }}
                          >
                            {item.count}
                          </div>
                        </div>
                        <div className="w-20 text-xs font-semibold text-right">
                          ${(item.value / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Win/Loss Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Closed Deals</p>
                    <p className="text-2xl font-bold">{stats.wonDeals + stats.lostDeals}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {((stats.wonDeals / (stats.wonDeals + stats.lostDeals)) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium">Won</span>
                    <span className="font-medium">{stats.wonDeals} deals</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(stats.wonDeals / (stats.wonDeals + stats.lostDeals)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600 font-medium">Lost</span>
                    <span className="font-medium">{stats.lostDeals} deals</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(stats.lostDeals / (stats.wonDeals + stats.lostDeals)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

