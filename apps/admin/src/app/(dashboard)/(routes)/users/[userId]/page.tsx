'use client'

import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import api from '@/lib/api'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { use } from 'react'

import type { OrderColumn } from '../../orders/components/table'
import { OrderTable } from '../../orders/components/table'
import { UserForm } from './components/user-form'

const UserPage = ({ params }: { params: Promise<{ userId: string }> }) => {
   const { userId } = use(params)
   const [user, setUser] = useState<any>({ orders: [] })
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchUser() {
         try {
            const data = await api.get(`/api/users/${userId}`)
            setUser(data)
         } catch (error) {
            console.error('Error fetching user:', error)
            setUser({ orders: [] })
         } finally {
            setLoading(false)
         }
      }
      fetchUser()
   }, [userId])

   if (loading) {
      return <div>Loading...</div>
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
