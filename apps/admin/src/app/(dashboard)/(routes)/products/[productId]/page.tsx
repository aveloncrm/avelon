'use client'

import api from '@/lib/api'
import { useEffect, useState } from 'react'
import { use } from 'react'

import { ProductForm } from './components/product-form'

export default function ProductPage({
   params,
}: {
   params: Promise<{ productId: string }>
}) {
   const { productId } = use(params)
   const [product, setProduct] = useState<any>(null)
   const [categories, setCategories] = useState<any[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchData() {
         try {
            const [productData, categoriesData] = await Promise.all([
               productId !== 'new' ? api.get(`/api/products/${productId}`).catch(() => null) : Promise.resolve(null),
               api.get('/api/categories'),
            ])
            setProduct(productData)
            setCategories(categoriesData)
         } catch (error) {
            console.error('Error fetching data:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchData()
   }, [productId])

   if (loading) {
      return <div>Loading...</div>
   }

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-6 pb-12">
            <ProductForm categories={categories} initialData={product} />
         </div>
      </div>
   )
}
