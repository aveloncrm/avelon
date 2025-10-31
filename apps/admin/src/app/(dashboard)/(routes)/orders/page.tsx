import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import serverApi from '@/lib/api-server'
import { format } from 'date-fns'

import { SortBy } from './components/options'
import type { OrderColumn } from './components/table'
import { OrderTable } from './components/table'

export default async function OrdersPage() {
   const response = await serverApi.get('/api/orders', { adminView: true })
   const orders = response.orders || []

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
         <OrderTable data={formattedOrders} />{' '}
      </div>
   )
}
