import { format } from 'date-fns'

import serverApi from '@/lib/api-server'

import { BannersColumn } from './components/table'
import { BannersClient } from './components/table'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default async function BannersPage() {
   const banners = await serverApi.get('/api/banners')

   const formattedBanners: BannersColumn[] = banners.map((item: any) => ({
      id: item.id,
      label: item.label,
      createdAt: format(new Date(item.createdAt), 'MMMM do, yyyy'),
   }))

   return (
      <div className="block space-y-4 my-6">
         <div className="flex items-center justify-between">
            <Heading
               title={`Banners (${banners.length})`}
               description="Manage banners for your store"
            />
            <Link href="/banners/new">
               <Button>
                  <Plus className="mr-2 h-4" /> Add New
               </Button>
            </Link>
         </div>
         <Separator />
         <BannersClient data={formattedBanners} />
      </div>
   )
}
