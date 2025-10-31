'use client'

import api from '@/lib/api'
import { useEffect, useState } from 'react'

import { CategoryForm } from '../[categoryId]/components/category-form'

const NewCategoryPage = () => {
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

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm banners={banners} initialData={null} />
         </div>
      </div>
   )
}

export default NewCategoryPage
