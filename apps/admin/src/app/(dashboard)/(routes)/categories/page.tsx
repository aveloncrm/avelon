'use client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { CategoriesClient, CategoryColumn } from './components/table'

export default function CategoriesPage() {
   const [categories, setCategories] = useState<any[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchCategories() {
         try {
            const data = await api.get('/api/categories')
            setCategories(data)
         } catch (error) {
            console.error('Error fetching categories:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchCategories()
   }, [])

   if (loading) {
      return <div>Loading...</div>
   }

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
