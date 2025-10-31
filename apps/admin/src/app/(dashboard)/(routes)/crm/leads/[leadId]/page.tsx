import { getEnrichedLead } from '@/lib/mock-data/crm-unified'
import { LeadForm } from './components/lead-form'
import { redirect } from 'next/navigation'

export default async function LeadPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params
  if (leadId === 'new') {
    return <LeadForm initialData={null} />
  }

  const enrichedLead = getEnrichedLead(leadId)

  if (!enrichedLead) {
    redirect('/crm/leads')
  }

  return <LeadForm initialData={enrichedLead} />
}

