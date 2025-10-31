'use client'

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api'
import { useEffect, useState } from 'react'

import { UsersTable } from './components/table'
import { UserColumn } from './components/table'

export default function UsersPage() {
   const [users, setUsers] = useState<any[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchUsers() {
         try {
            const data = await api.get('/api/users')
            setUsers(data)
         } catch (error) {
            console.error('Error fetching users:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchUsers()
   }, [])

   if (loading) {
      return <div>Loading...</div>
   }

   const formattedUsers: UserColumn[] = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      orders: 0, // Order count would need separate calculation
   }))

   return (
      <div className="block space-y-4 my-6">
         <Heading title="Users" description="Manage products for your store" />
         <Separator />
         <UsersTable data={formattedUsers} />
      </div>
   )
}
