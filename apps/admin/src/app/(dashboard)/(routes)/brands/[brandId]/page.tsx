import serverApi from '@/lib/api-server'

import { BrandForm } from './components/brand-form'

const BrandPage = async ({ params }: { params: Promise<{ brandId: string }> }) => {
   const { brandId } = await params
   
   let brand = null
   if (brandId !== 'new') {
      try {
         brand = await serverApi.get(`/api/brands/${brandId}`)
      } catch (error) {
         console.error('Error fetching brand:', error)
      }
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
