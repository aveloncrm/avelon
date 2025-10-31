import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import serverApi from '@/lib/api-server'
import { format } from 'date-fns'

import type { OrderColumn } from '../../orders/components/table'
import { OrderTable } from '../../orders/components/table'
import { UserForm } from './components/user-form'

const UserPage = async ({ params }: { params: Promise<{ userId: string }> }) => {
   const { userId } = await params
   
   let user: any = null
   try {
      user = await serverApi.get(`/api/users/${userId}`)
   } catch (error) {
      console.error('Error fetching user:', error)
      user = { orders: [] }
   }

   function OrdersCard() {
      const { orders } = user

      const formattedOrders: OrderColumn[] = (orders || []).map((order: any) => ({
         id: order.id,
         number: `Order #${order.number}`,
         date: new Date(order.createdAt).toUTCString(),
         payable: '$' + order.payable.toString(),
         isPaid: order.isPaid,
         createdAt: format(new Date(order.createdAt), 'MMMM do, yyyy'),
      }))

      return (
         <Card className="my-4 p-2">
            <CardContent>
               <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-2">
                     <AccordionTrigger>
                        <div className="block">
                           <h2 className="text-lg font-bold tracking-wider text-left">
                              ORDER HISTORY
                           </h2>
                           <p className="text-sm font-light text-foreground/70 text-left">
                              User in this order.
                           </p>
                        </div>
                     </AccordionTrigger>
                     <AccordionContent>
                        <OrderTable data={formattedOrders} />
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            </CardContent>
         </Card>
      )
   }

   function UserCard() {
      return (
         <Card className="my-4 p-2 pb-0">
            <CardContent>
               <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-2">
                     <AccordionTrigger>
                        <div className="block">
                           <h2 className="text-lg font-bold tracking-wider text-left">
                              USER
                           </h2>
                           <p className="text-sm font-light text-foreground/70">
                              User in this order.
                           </p>
                        </div>
                     </AccordionTrigger>
                     <AccordionContent>
                        <UserForm initialData={user} />
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            </CardContent>
         </Card>
      )
   }

   return (
      <div className="flex-col">
         <div className="flex-1 pt-6 pb-12">
            <div className="flex items-center justify-between">
               <Heading
                  title="User Data"
                  description="Items in this order and data about the user."
               />
            </div>
            <UserCard />
            <OrdersCard />
         </div>
      </div>
   )
}

export default UserPage
