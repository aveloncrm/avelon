'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Plus, LayoutGrid, Table as TableIcon } from 'lucide-react'
import { getAllEnrichedLeads } from '@/lib/mock-data/crm-unified'
import { LeadsTable } from './components/leads-table'
import { LeadsKanban } from './components/leads-kanban'
import Link from 'next/link'

export default function LeadsPage() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const enrichedLeads = getAllEnrichedLeads()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title={`Leads (${enrichedLeads.length})`}
            description="Manage and track your sales leads with integrated scoring"
          />
          <div className="flex gap-2">
            <div className="flex rounded-md shadow-sm">
              <Button
                variant={view === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('kanban')}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Board
              </Button>
              <Button
                variant={view === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('table')}
                className="rounded-l-none"
              >
                <TableIcon className="h-4 w-4 mr-2" />
                Table
              </Button>
            </div>
            <Link href="/crm/leads/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Lead
              </Button>
            </Link>
          </div>
        </div>
        <Separator />

        {view === 'kanban' ? (
          <LeadsKanban leads={enrichedLeads} />
        ) : (
          <LeadsTable data={enrichedLeads} />
        )}
      </div>
    </div>
  )
}

