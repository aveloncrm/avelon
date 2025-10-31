import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import serverApi from '@/lib/api-server'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { CategoriesClient, CategoryColumn } from './components/table'

export default async function CategoriesPage() {
   const categories = await serverApi.get('/api/categories')

   const formattedCategories: CategoryColumn[] = categories.map((category: any) => ({
      id: category.id,
      title: category.title,
      products: 0, // Products count would need separate calculation
   }))

   return (
      <div className="my-6 block space-y-4">
         <div className="flex items-center justify-between">
            <Heading
               title={`Categories (${categories.length})`}
               description="Manage categories for your store"
            />
            <Link href="/categories/new">
               <Button>
                  <Plus className="mr-2 h-4" /> Add New
               </Button>
            </Link>
         </div>
         <Separator />
         <CategoriesClient data={formattedCategories} />
      </div>
   )
}
