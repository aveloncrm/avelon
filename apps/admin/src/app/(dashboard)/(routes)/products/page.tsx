'use client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api'
import { formatter } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ProductsTable } from './components/table'
import { ProductColumn } from './components/table'

export default function ProductsPage() {
   const [products, setProducts] = useState<any[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchProducts() {
         try {
            const data = await api.get('/api/products')
            setProducts(data)
         } catch (error) {
            console.error('Error fetching products:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchProducts()
   }, [])

   if (loading) {
      return <div>Loading...</div>
   }

   const formattedProducts: ProductColumn[] = products.map((product: any) => ({
      id: product.id,
      title: product.title,
      price: formatter.format(product.price),
      discount: formatter.format(product.discount),
      category: product.categories?.[0]?.title || 'N/A',
      sales: 0, // Sales data would need separate API endpoint
      isAvailable: product.isAvailable,
   }))

   return (
      <div className="block space-y-4 my-6">
         <div className="flex items-center justify-between">
            <Heading
               title={`Products (${products.length})`}
               description="Manage products for your store"
            />
            <Link href="/products/new">
               <Button>
                  <Plus className="mr-2 h-4" /> Add New
               </Button>
            </Link>
         </div>
         <Separator />
         <ProductsTable data={formattedProducts} />
      </div>
   )
}
