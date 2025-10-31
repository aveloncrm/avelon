import { getDealById } from '@/lib/mock-data/crm-deals'
import { DealForm } from './components/deal-form'
import { redirect } from 'next/navigation'

export default async function DealPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params
  if (dealId === 'new') {
    return <DealForm initialData={null} />
  }

  const deal = getDealById(dealId)

  if (!deal) {
    redirect('/crm/pipeline')
  }

  return <DealForm initialData={deal} />
}

