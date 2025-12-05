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
            const response = await api.get<{ users: any[]; pagination: any }>('/api/users')
            setUsers(response.users || [])
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
      name: user.name || 'N/A',
      email: user.email || 'N/A',
      phone: user.phone || 'N/A',
      orders: user.orders?.length || 0,
   }))

   return (
      <div className="block space-y-4 my-6">
         <Heading title="Users" description="Manage users for your store" />
         <Separator />
         <UsersTable data={formattedUsers} />
      </div>
   )
}
