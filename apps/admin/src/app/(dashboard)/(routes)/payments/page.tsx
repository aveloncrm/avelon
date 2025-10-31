import serverApi from '@/lib/api-server'
import { format } from 'date-fns'

import { PaymentClient } from './components/client'
import type { PaymentColumn } from './components/columns'

export default async function PaymentsPage() {
   const payments = await serverApi.get('/api/payments')

   const formattedPayments: PaymentColumn[] = payments.map((payment: any) => ({
      id: payment.id,
      number: 'Payment #' + payment.number.toString(),
      status: payment.status,
      date: new Date(payment.createdAt).toUTCString(),
      payable: '$' + payment.payable.toString(),
      isSuccessful: payment.isSuccessful,
      createdAt: format(new Date(payment.createdAt), 'MMMM do, yyyy'),
   }))

   return <PaymentClient data={formattedPayments} />
}
