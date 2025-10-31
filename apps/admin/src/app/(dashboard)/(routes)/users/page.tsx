import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import serverApi from '@/lib/api-server'

import { UsersTable } from './components/table'
import { UserColumn } from './components/table'

export default async function UsersPage() {
   const users = await serverApi.get('/api/users')

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
