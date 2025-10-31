'use client'

import api from '@/lib/api'
import { useEffect, useState } from 'react'
import { use } from 'react'

import { BannerForm } from './components/banner-form'

const Page = ({ params }: { params: Promise<{ bannerId: string }> }) => {
   const { bannerId } = use(params)
   const [banner, setBanner] = useState<any>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchBanner() {
         try {
            if (bannerId !== 'new') {
               const data = await api.get(`/api/banners/${bannerId}`)
               setBanner(data)
            }
         } catch (error) {
            console.error('Error fetching banner:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchBanner()
   }, [bannerId])

   if (loading && bannerId !== 'new') {
      return <div>Loading...</div>
   }

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-6">
            <BannerForm initialData={banner} />
         </div>
      </div>
   )
}

export default Page
