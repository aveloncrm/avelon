import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import serverApi from '@/lib/api-server'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { BrandColumn, BrandsClient } from './components/table'

export const dynamic = 'force-dynamic'

export default async function BrandsPage() {
   const brands = await serverApi.get('/api/brands')

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
