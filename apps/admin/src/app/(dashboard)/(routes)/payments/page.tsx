'use client'

import api from '@/lib/api'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import { PaymentClient } from './components/client'
import type { PaymentColumn } from './components/columns'

export default function PaymentsPage() {
   const [payments, setPayments] = useState<any[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchPayments() {
         try {
            const data = await api.get('/api/payments')
            setPayments(data)
         } catch (error) {
            console.error('Error fetching payments:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchPayments()
   }, [])

   if (loading) {
      return <div>Loading...</div>
   }

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
