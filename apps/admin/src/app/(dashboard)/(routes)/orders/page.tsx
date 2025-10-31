'use client'

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import { SortBy } from './components/options'
import type { OrderColumn } from './components/table'
import { OrderTable } from './components/table'

export default function OrdersPage() {
   const [orders, setOrders] = useState<any[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchOrders() {
         try {
            const response = await api.get('/api/orders', { adminView: true })
            setOrders(response.orders || [])
         } catch (error) {
            console.error('Error fetching orders:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchOrders()
   }, [])

   if (loading) {
      return <div>Loading...</div>
   }

   const formattedOrders: OrderColumn[] = orders.map((order: any) => ({
      id: order.id,
      number: `Order #${order.number}`,
      date: new Date(order.createdAt).toUTCString(),
      payable: '$' + order.payable.toString(),
      isPaid: order.isPaid,
      createdAt: format(new Date(order.createdAt), 'MMMM do, yyyy'),
   }))

   return (
      <div className="block space-y-4 my-6">
         <Heading
            title={`Orders (${orders.length})`}
            description="Manage orders for your store"
         />
         <Separator />
         <div className="grid grid-cols-4 gap-2">
            <SortBy initialData={'highest_payable'} />
         </div>
         <OrderTable data={formattedOrders} />
      </div>
   )
}
