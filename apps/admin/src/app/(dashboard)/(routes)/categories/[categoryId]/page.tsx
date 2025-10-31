'use client'

import api from '@/lib/api'
import { useEffect, useState } from 'react'
import { use } from 'react'

import { CategoryForm } from './components/category-form'

const CategoryPage = ({
   params,
}: {
   params: Promise<{ categoryId: string; id: string }>
}) => {
   const { categoryId } = use(params)
   const [category, setCategory] = useState<any>(null)
   const [banners, setBanners] = useState<any[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchData() {
         try {
            const [categoryData, bannersData] = await Promise.all([
               categoryId !== 'new' ? api.get(`/api/categories/${categoryId}`).catch(() => null) : Promise.resolve(null),
               api.get('/api/banners'),
            ])
            setCategory(categoryData)
            setBanners(bannersData)
         } catch (error) {
            console.error('Error fetching data:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchData()
   }, [categoryId])

   if (loading) {
      return <div>Loading...</div>
   }

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm banners={banners} initialData={category} />
         </div>
      </div>
   )
}

export default CategoryPage
