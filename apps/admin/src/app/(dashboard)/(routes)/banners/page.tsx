'use client'

import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import api from '@/lib/api'
import { BannersColumn } from './components/table'
import { BannersClient } from './components/table'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function BannersPage() {
   const [banners, setBanners] = useState<any[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchBanners() {
         try {
            const data = await api.get('/api/banners')
            setBanners(data)
         } catch (error) {
            console.error('Error fetching banners:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchBanners()
   }, [])

   if (loading) {
      return <div>Loading...</div>
   }

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
