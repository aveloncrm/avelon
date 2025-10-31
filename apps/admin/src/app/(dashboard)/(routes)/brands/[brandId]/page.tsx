'use client'

import api from '@/lib/api'
import { useEffect, useState } from 'react'
import { use } from 'react'

import { BrandForm } from './components/brand-form'

const BrandPage = ({ params }: { params: Promise<{ brandId: string }> }) => {
   const { brandId } = use(params)
   const [brand, setBrand] = useState<any>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchBrand() {
         try {
            if (brandId !== 'new') {
               const data = await api.get(`/api/brands/${brandId}`)
               setBrand(data)
            }
         } catch (error) {
            console.error('Error fetching brand:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchBrand()
   }, [brandId])

   if (loading && brandId !== 'new') {
      return <div>Loading...</div>
   }

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <BrandForm initialData={brand} />
         </div>
      </div>
   )
}

export default BrandPage
