import serverApi from '@/lib/api-server'

import { BannerForm } from './components/banner-form'

const Page = async ({ params }: { params: Promise<{ bannerId: string }> }) => {
   const { bannerId } = await params
   
   let banner = null
   if (bannerId !== 'new') {
      try {
         banner = await serverApi.get(`/api/banners/${bannerId}`)
      } catch (error) {
         console.error('Error fetching banner:', error)
      }
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
