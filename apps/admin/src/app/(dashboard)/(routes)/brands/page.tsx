'use client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { BrandColumn, BrandsClient } from './components/table'

export default function BrandsPage() {
   const [brands, setBrands] = useState<any[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchBrands() {
         try {
            const data = await api.get('/api/brands')
            setBrands(data)
         } catch (error) {
            console.error('Error fetching brands:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchBrands()
   }, [])

   if (loading) {
      return <div>Loading...</div>
   }

   const formattedBrands: BrandColumn[] = brands.map((brand: any) => ({
      id: brand.id,
      title: brand.title,
      products: 0, // Products count would need separate calculation
   }))

   return (
      <div className="my-6 block space-y-4">
         <div className="flex items-center justify-between">
            <Heading
               title={`Brands (${brands.length})`}
               description="Manage brands for your store"
            />
            <Link href="/brands/new">
               <Button>
                  <Plus className="mr-2 h-4" /> Add New
               </Button>
            </Link>
         </div>
         <Separator />
         <BrandsClient data={formattedBrands} />
      </div>
   )
}
